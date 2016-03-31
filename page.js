(function() {


/*----------------------------------------------------------------------------*/
/* globals                                                                    */
/*----------------------------------------------------------------------------*/

var allTopic = 'All';
var postPrefix = 'post_';
var filterPrefix = 'filter_';

var cookies = parseCookies();
var queryParameters = parseQueryParameters();


/*----------------------------------------------------------------------------*/
/* main                                                                       */
/*----------------------------------------------------------------------------*/

Vue.filter('displayDate', function(post) {
  return formatDate(post.date);
});

Vue.filter('displayTopics', function(post) {
  return post.topics.filter(function (topic) {
    return topic !== allTopic;
  }).join(', ');
});

Vue.filter('marked', marked);

new Vue({
  el: '#page',

  data: {
    posts: [],
    styling: {},
    meta: {},
    filters: [],
    filterKey: allTopic,
    searchKey: '',
    selectedPostUid: ''
  },

  ready: function() {
    this.fetchData();
  },

  methods: {
    fetchData: function() {
      var vue = this;
      getJson(formatDataUrl(), function(data) {
        vue.$set('posts', createPosts(data.content));
        vue.$set('filters', createFilters(data.content));
        vue.$set('styling', data.styling);
        vue.$set('meta', data.meta);
        vue.highlightPost(queryParameters.selectedPostUid);
      });
    },

    highlightPost: function(uid) {
      if (!uid) {
        return;
      }

      this.posts.sort(function(a, b) {
        if (a.uid === uid) {
          return -1;
        }
        if (b.uid === uid) {
          return 1;
        }
        return 0;
      });

      this.$set('selectedPostUid', uid);
    }
  }
});

function createPosts(posts) {
  return posts.map(function(post) {
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
  var topicCounter = {};
  var totalPosts = 0;
  var newPosts = 0;

  posts.map(function(post) {
    var isNew = parseDate(post.date) >= cookies.lastVisited ? 1 : 0;

    post.topics.map(function(topic) {
      totalPosts += 1;
      newPosts += isNew;

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

  var filters = [];
  for (var key in topicCounter) {
    if (topicCounter.hasOwnProperty(key)) {
      filters.push({
        name: key,
        topic: key,
        newPosts: topicCounter[key].newPosts,
        totalPosts: topicCounter[key].totalPosts,
        uid: filterPrefix + idFromFilter(key)
      });
    }
  }

  filters.sort(function(a, b) {
    return b.totalPosts - a.totalPosts;
  });

  return filters;
}


/*----------------------------------------------------------------------------*/
/* helpers                                                                    */
/*----------------------------------------------------------------------------*/

function formatDataUrl() {
  var user = window.location.hostname.split('.')[0];
  var repo = window.location.pathname;
  return 'https://raw.githubusercontent.com/' + user + repo + 'master/data.json';
}

function idFromFilter(filter) {
  return filter.toLowerCase().replace(/[^a-z]/g, '');
}

function idFromPost(post) {
  var title = post.title.toLowerCase().replace(/[^a-z ]/g, '');
  var titleId = title.split(' ').map(function (word) {
    return word.charAt(0);
  }).join('');

  var date = parseDate(post.date).toString().toLowerCase().split(' ');
  var dateId = date[2] + date[1] + date[3].substring(2, 4);

  return dateId + titleId;
}

function parseQueryParameters() {
  return {
    selectedPostUid: parseHash(postPrefix)
  };
}

function parseCookies() {
  var lastVisited = Cookies.get('lastVisited');
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
    lastVisited: lastVisited
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
  var hash = window.location.hash;
  return startsWith(hash, '#' + prefix) ? hash.substring(1) : undefined;
}

function parseDate(str) {
  var parts = str.split('-');
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
    error: function(response) {
      showError('AJAX error: ' + response.statusText)
      console.log(JSON.stringify(response));
    },
    failure: function(response) {
      showError('AJAX failure: ' + respones.statusText);
      console.log(JSON.stringify(response));
    }
  });
}

function showError(message) {
  var content = '<i class="material-icons">error</i>' +
                '<span class="message">' + message + '</span>';
  Materialize.toast(content, undefined, 'error');
}


})();
