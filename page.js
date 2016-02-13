(function() {

var user = window.location.hostname.split('.')[0];
var repo = window.location.pathname;
var dataUrl = 'https://raw.githubusercontent.com/' + user + repo + 'master/data.json';

var lastVisited = handleCookies();

$.ajax({
  url: dataUrl,
  dataType: 'json',
  crossDomain: true,
  success: function(data) {
    $(document).ready(function() {
      detectBrowser();
      applyStyling(data.styling);
      setupContent(data.content);
    });
  },
  error: function(response) {
    console.log('AJAX error: ' + JSON.stringify(response));
  },
  failure: function(response) {
    console.log('AJAX failure: ' + JSON.stringify(response));
  }
});

function handleCookies() {
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

  return lastVisited;
}

function setupContent(content) {
  var grid = createGrid(content);
  setupGrid(grid);

  createFiltersAndSearch();
  setupFiltersAndSearch(grid);

  createSorts();
  setupSorts(grid);

  handleQueryParameters();
}

function applyStyling(styling) {
  $('body').addClass(styling.backgroundColor);
  $('#nav').addClass(styling.navbarColor);
  $('#page').removeClass('hide');
}

function detectBrowser() {
  if (isInternetExplorer()) {
    $('html').addClass('ie');
  }
}

function hashCode(str) {
  var hash = 0;
  for (var i=str.length-1; i>=0; i--) {
    var chr = str.charCodeAt(i);
    hash = ((hash<<5)-hash)+chr;
    hash = hash & hash;
  }
  return hash;
}

function addUniqueIds(data) {
  data.map(function(el) {
    el.uid = hashCode(JSON.stringify(data));
  });
  return data;
}

function createGrid(data) {
  $('#content').handlebars($('#content-template'), addUniqueIds(data));
  return $('#content .row');
}

function setupGrid(grid) {
  grid.shuffle({
    itemSelector: '.card'
  });
  grid.shuffle('shuffle', '');
}

function unique(array) {
  return array.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });
}

function createFiltersData() {
  var groupCounter = {};
  var totalPosts = 0;
  var newPosts = 0;

  $('[data-groups]').map(function() {
    var card = $(this);
    var isNew = parseDate(card.data('date')) >= lastVisited ? 1 : 0;

    card.data('groups').map(function(groupName) {
      totalPosts += 1;
      newPosts += isNew;

      if (groupName in groupCounter) {
        groupCounter[groupName].totalPosts += 1;
        groupCounter[groupName].newPosts += isNew;
      } else {
        groupCounter[groupName] = {
          totalPosts: 1,
          newPosts: isNew
        };
      }
    });
  });

  var filters = [];
  for (var key in groupCounter) {
    if (groupCounter.hasOwnProperty(key)) {
      filters.push({
        'name': key,
        'newPosts': groupCounter[key].newPosts,
        'totalPosts': groupCounter[key].totalPosts
      });
    }
  }
  filters.sort(function(a, b) { return b.totalPosts - a.totalPosts; });

  return {
    'filters': filters,
    'newPosts': newPosts,
    'totalPosts': totalPosts
  };
}

function parseDate(str) {
  var parts = str.split('-');
  return new Date(parts[0], parts[1]-1, parts[2]);
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function createFiltersAndSearch() {
  $('#filters').handlebars($('#filters-template'), createFiltersData());

  $('#search').handlebars($('#search-template'), {});
}

function setupFiltersAndSearch(grid) {
  var filters = $('#filters-dropdown .filter');

  var search_form = $('#search-form');
  var search_input = search_form.find('#search-input');
  var search_close = search_form.find('.material-icons:contains("close")');

  function isMatch(content, terms) {
    var notFound = terms.filter(function(term) {
      return content.toLowerCase().indexOf(term.toLowerCase()) === -1;
    });

    return notFound.length === 0;
  }

  function executeSearch() {
    var query = search_input.val().split(' ');

    grid.shuffle('shuffle', function(el, shuffle) {
      if (shuffle.group !== 'all' && $.inArray(shuffle.group, el.data('groups')) === -1) {
        return false;
      }

      var content = $.trim(el.find('.card-content').text()).toLowerCase();
      return isMatch(content, query);
    });
  }

  function clearSearch() {
    search_input.val('');
    executeSearch();
  }

  filters.click(function(e) {
    e.preventDefault();

    var filter = $(this);
    var group = filter.data('group');

    filters.removeClass('active');
    filter.addClass('active');

    grid.shuffle('shuffle', group);
    executeSearch();
  });

  search_form.submit(function(e) {
    e.preventDefault();

    executeSearch();
  });

  search_close.click(function(e) {
    e.preventDefault();

    clearSearch();
  });
}

function createSorts() {
  $('#sorts').handlebars($('#sorts-template'), {});
}

function setupSorts(grid) {
  var sorts = $('#sorts-dropdown .sort');

  sorts.click(function(e) {
    e.preventDefault();

    var sort = $(this);
    var by = sort.data('by');
    var reverse = sort.data('reverse');

    sorts.removeClass('active');
    sort.addClass('active');

    grid.shuffle('sort', {
      by: function(el) {
        return el.data(by).toLowerCase();
      },
      reverse: reverse
    });
  });
}

function scrollTo(el, extraOffset) {
  if (!el.length) {
    return;
  }
  if (!extraOffset) {
    extraOffset = 0;
  }

  var elOffset = el.offset().top;
  var elHeight = el.height();
  var windowHeight = $(window).height();

  var scrollTop = elOffset - windowHeight/2 - extraOffset + elHeight/2;
  $('html, body').animate({
    scrollTop: scrollTop
  }, 0);
}

function isFirefox() {
  return /Firefox/i.test(navigator.userAgent);
}

function isInternetExplorer() {
  return /MSIE/i.test(navigator.userAgent) ||
    /Trident/i.test(navigator.userAgent);
}

function onAnyUserInteraction(callback) {
  var events = [
    'click',
    'keydown',
    isFirefox() ? 'DOMMouseScroll' : 'mousewheel'
  ];

  $('body').on(events.join(' '), callback);
}

function focus(el) {
  if (!el.length) {
    return;
  }

  $('.card').addClass('deemphasize');
  el.removeClass('deemphasize');

  onAnyUserInteraction(function() {
    $('.card').removeClass('deemphasize');
  });

  scrollTo(el, $('#nav-container').height());
}

function handleQueryParameters() {
  var queryParameters = URI(document.URL).query(true);

  var postId = queryParameters['postId'];
  if (postId) {
    focus($('#' + postId));
  }
}

})();
