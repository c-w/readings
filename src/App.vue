<template>
  <div id="page" v-bind:class="styling.backgroundColor" v-cloak>
    <div id="nav-container" class="navbar-fixed" role="navigation">
      <nav v-bind:class="styling.navbarColor">
        <div class="nav-wrapper">
          <ul class="left">
            <li>
              <div id="filters">
                <ul id="filters-dropdown" class="dropdown-content">
                  <li v-for="filter in filters"
                      v-bind:key="filter.topic"
                      v-bind:class="{'active': filterKey === filter.topic}"
                      class="dropdown-item filter">
                    <a v-on:click="filterKey = filter.topic"
                        v-bind:href="`#${filter.uid}`" role="button">
                      <span class="dropdown-label-text">{{filter.name}}</span>
                      <span v-if="filter.totalPosts"
                            class="badge">{{filter.totalPosts}}</span>
                      <span v-if="filter.newPosts"
                            class="badge new">{{filter.newPosts}}</span>
                    </a>
                  </li>
                </ul>
                <a data-activates="filters-dropdown"
                    data-constrainwidth="false"
                    data-beloworigin="true"
                    data-alignment="right"
                    class="dropdown-button" href="#!" role="button"
                    id="filters-trigger">
                  <i class="icon filter zmdi zmdi-filter-list tooltipped"
                      data-tooltip="Filter"
                      data-delay="25"
                      data-position="right"></i>
                </a>
              </div>
            </li>

            <li>
              <div id="search" class="search-form">
                <div class="input-field">
                  <input v-model="searchKey"
                          role="search"
                          autocomplete="off"
                          debounce="300"
                          type="search"
                          class="search form-control"
                          id="search-input"/>
                  <label for="search-input">
                    <i class="icon search zmdi zmdi-search tooltipped"
                        data-tooltip="Search"
                        data-delay="25"
                        data-position="right"></i>
                  </label>
                </div>
              </div>
            </li>
          </ul>

          <span class="brand-logo center"
            v-if="meta && meta.title">{{meta.title}}</span>

          <ul class="right">
            <li>
              <a class="valign-wrapper modal-trigger" href="#about"
                  v-show="meta && meta.about">
                <i class="icon info zmdi zmdi-info tooltipped"
                      data-tooltip="What's this?"
                      data-delay="25"
                      data-position="left"></i>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <div id="about" class="modal">
      <div class="modal-content image-text-wrap">
        <span v-if="meta && meta.about && meta.about.avatar">
          <img class="image-text-wrap-left" alt="Avatar"
                v-bind:src="meta.about.avatar">
        </span>
        <span v-if="meta && meta.about && meta.about.blurb" v-html="markdownToHtml(meta.about.blurb)" />
      </div>
      <div class="modal-footer">
        <a class="modal-action modal-close" href="#!" role="button">
          <i class="modal-menu icon close zmdi zmdi-close"></i>
        </a>
      </div>
    </div>

    <div id="posts" role="main">
      <div class="container">
        <div class="row">
          <transition-group name="fade">
            <div v-for="post in filteredPosts"
                v-bind:key="post.uid"
                v-bind:class="{'deemphasize': selectedPostUid && selectedPostUid !== post.uid}"
                class="post card col s12 hoverable">
              <div class="card-deselect">
                <a v-if="selectedPostUid === post.uid"
                  v-on:click="selectedPostUid = ''"
                  href="#!" role="button">
                  <i class="icon close card-menu zmdi zmdi-close"></i>
                </a>
              </div>
              <div class="card-block card-content">
                <h4 class="card-title">{{post.title}}</h4>
                <p class="card-text" v-html="markdownToHtml(post.summary)" />
              </div>
              <div class="card-block card-action activator">
                <a v-if="post.url"
                  class="card-link" v-bind:href="post.url">Origin</a>
                <a v-on:click="selectedPostUid = post.uid"
                  class="card-link" v-bind:href="`#${post.uid}`">Permalink</a>
                <i class="card-menu icon more zmdi zmdi-more-vert"></i>
              </div>
              <div class="card-reveal">
                <h4 class="card-title">{{post.title}}<i class="card-menu icon close zmdi zmdi-close"></i></h4>
                <p class="card-text">
                  <ul>
                    <li>Date: {{post | displayDate}}</li>
                    <li>Topics: {{post | displayTopics}}</li>
                    <li>Type: {{post.type}}</li>
                  </ul>
                </p>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
/*----------------------------------------------------------------------------*/
/* globals                                                                    */
/*----------------------------------------------------------------------------*/

const allTopic = 'All';
const postPrefix = 'post_';
const filterPrefix = 'filter_';

const cookies = parseCookies();
const queryParameters = parseQueryParameters();


/*----------------------------------------------------------------------------*/
/* main                                                                       */
/*----------------------------------------------------------------------------*/

/* global Materialize, $ */

import * as Cookies from 'js-cookie';
import * as marked from 'marked';

export default {
  data: function() {
    return {
      posts: [],
      styling: {},
      meta: {},
      filters: [],
      filterKey: allTopic,
      searchKey: '',
      selectedPostUid: ''
    };
  },

  filters: {
    displayDate: function(post) {
      return formatDate(post.date);
    },

    displayTopics: function(post) {
      return post.topics.filter((topic) => topic !== allTopic).join(', ');
    },
  },

  mounted: function() {
    this.fetchData();
  },

  computed: {
    filteredPosts: function() {
      const search = this.searchKey.toLowerCase();

      return this.posts
        .filter(post => post.topics.indexOf(this.filterKey) !== -1)
        .filter(post => `${post.title} ${post.summary}`.toLowerCase().indexOf(search) !== -1)
    }
  },

  methods: {
    markdownToHtml: function(markdown) {
      return markdown ? marked(markdown) : "";
    },

    fetchData: function() {
      getJson(formatDataUrl(), (data) => {
        this.posts = createPosts(data.content);
        this.filters = createFilters(data.content);
        this.styling = data.styling;
        this.meta = data.meta;
        this.highlightPost(queryParameters.selectedPostUid);
        this.setupMaterialize();
      });
    },

    highlightPost: function(uid) {
      if (!uid) {
        return;
      }

      this.posts.sort((a, b) => {
        if (a.uid === uid) {
          return -1;
        }
        if (b.uid === uid) {
          return 1;
        }
        return 0;
      });

      this.selectedPostUid = uid;
    },

    setupMaterialize: function() {
      $('.dropdown-button').each(function() {
        $(this).dropdown();
      });
      $('.modal-trigger').leanModal();
    }
  }
};

function createPosts(posts) {
  return posts.map((post) => {
    post.topics.unshift(allTopic);

    return {
      date: parseDate(post.date),
      summary: post.summary,
      title: post.title,
      topics: post.topics,
      type: post.type,
      url: post.url,
      uid: postPrefix + idFromPost(post)
    };
  });
}

function createFilters(posts) {
  const topicCounter = {};

  posts.map((post) => {
    const isNew = parseDate(post.date) >= cookies.lastVisited ? 1 : 0;

    post.topics.map((topic) => {
      if (topic in topicCounter) {
        topicCounter[topic].totalPosts += 1;
        topicCounter[topic].newPosts += isNew;
      } else {
        topicCounter[topic] = {
          totalPosts: 1,
          newPosts: isNew
        };
      }
    });
  });

  const filters = Object.keys(topicCounter).map(key => ({
    name: key,
    topic: key,
    newPosts: topicCounter[key].newPosts,
    totalPosts: topicCounter[key].totalPosts,
    uid: filterPrefix + idFromFilter(key)
  }));

  filters.sort((a, b) => b.totalPosts - a.totalPosts);

  return filters;
}


/*----------------------------------------------------------------------------*/
/* helpers                                                                    */
/*----------------------------------------------------------------------------*/

function formatDataUrl() {
  return 'https://raw.githubusercontent.com/c-w/readings/master/data.json';
}

function idFromFilter(filter) {
  return filter.toLowerCase().replace(/[^a-z]/g, '');
}

function idFromPost(post) {
  const title = post.title.toLowerCase().replace(/[^a-z0-9 ]/g, '');
  const titleId = title.split(' ').map((word) => word.charAt(0)).join('');

  const date = parseDate(post.date).toString().toLowerCase().split(' ');
  const dateId = date[2] + date[1] + date[3].substring(2, 4);

  return dateId + titleId;
}

function parseQueryParameters() {
  return {
    selectedPostUid: parseHash(postPrefix)
  };
}

function parseCookies() {
  let lastVisited = Cookies.get('lastVisited');
  if (lastVisited !== undefined) {
    lastVisited = new Date(parseDate(lastVisited));
  } else {
    lastVisited = new Date();
  }

  Cookies.set('lastVisited', formatDate(new Date()), {
    expires: 365,
    domain: window.location.hostname
  });

  return {
    lastVisited
  };
}


/*----------------------------------------------------------------------------*/
/* utilities                                                                  */
/*----------------------------------------------------------------------------*/

function pad(str, width, chr) {
  str = '' + str;
  return str.length < width
    ? new Array(width - str.length + 1).join(chr || '0') + str
    : str;
}

function startsWith(str, prefix) {
  return str.indexOf(prefix) === 0;
}

function parseHash(prefix) {
  const hash = window.location.hash;
  return startsWith(hash, `#${prefix}`) ? hash.substring(1) : undefined;
}

function parseDate(str) {
  const parts = str.split('-');
  return new Date(parts[0], parts[1]-1, parts[2]);
}

function formatDate(date) {
  return date.getFullYear()
    + '-' + pad(date.getMonth()+1, 2)
    + '-' + pad(date.getDate(), 2);
}

function getJson(url, callback) {
  $.ajax({
    url: url,
    dataType: 'json',
    crossDomain: true,
    success: callback,
    error: (response) => {
      showError(`AJAX error: ${response.statusText}`);
      console.log(JSON.stringify(response)); // eslint-disable-line no-console
    },
    failure: (response) => {
      showError(`AJAX failure: ${response.statusText}`);
      console.log(JSON.stringify(response)); // eslint-disable-line no-console
    }
  });
}

function showError(message) {
  const content = '<i class="material-icons">error</i>' +
                  `<span class="message">${message}</span>`;
  Materialize.toast(content, undefined, 'error');
}
</script>

<style>
.dropdown-content {
  overflow-x: hidden;
}

.modal-content.image-text-wrap::after {
  display: block;
  clear: both;
  content: "";
}

.image-text-wrap-left {
  float: left;
  margin-right: 10px;
}

.deemphasize {
  opacity: .3 !important;
}

.modal-menu,
.card-menu {
  position: absolute;
  color: black;
  cursor: pointer;
}

.modal-action .modal-menu,
.card-action .card-menu,
.card-reveal .card-menu {
  bottom: 20px;
}

.card-reveal .card-menu.icon.close {
  right: 25px;
}

.modal-action .modal-menu.icon.close,
.card-action .card-menu.icon.more {
  right: 15px;
}

.card-deselect .card-menu {
  top: 15px;
}

.card-deselect .card-menu.icon.close {
  right: 15px;
}

.toast.error .message {
  padding-left: 5px;
  padding-right: 5px;
}

.fade-enter-active,
.fade-enter-move,
.fade-leave-active {
  transition: all .5s ease;
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.icon {
  font-size: 25px;
}

nav .icon {
  color: rgba(255, 255, 255, .7);
}

nav .active .icon {
  color: rgba(255, 255, 255, 1);
}

[v-cloak] {
  display: none;
}

@-ms-viewport {
  width: device-width;
}

nav input[type="search"] {
  height: 64px;
}

#page {
  height: 100%;
  min-height: 100vh;
}
</style>
