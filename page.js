var user = window.location.hostname.split('.')[0];
var dataUrl = 'https://rawgit.com/' + user + '/Datamine.me/master/readings.json';

$.ajax({
  url: dataUrl,
  dataType: 'json',
  crossDomain: true,
  success: function(data) {
    $(document).ready(function() {
      init(data);
    });
  },
  error: function(response) {
    console.log('AJAX error: ' + JSON.stringify(response));
  },
  failure: function(response) {
    console.log('AJAX failure: ' + JSON.stringify(response));
  }
});

function init(data) {
  var grid = createGrid(data);
  setupGrid(grid);

  createFiltersAndSearch();
  setupFiltersAndSearch(grid);

  createSorts();
  setupSorts(grid);
}

function createGrid(data) {
  $('#content').handlebars($('#content-template'), data);
  return $('#content .row');
}

function setupGrid(grid) {
  grid.shuffle({
    itemSelector: '.card'
  });
}

function createFiltersAndSearch() {
  var allGroups = $.unique($('[data-groups]').map(function() { return $(this).data('groups'); })).toArray();
  $('#filters').handlebars($('#filters-template'), allGroups);

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
