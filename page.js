var user = window.location.hostname.split(".")[0];
var dataUrl = "https://rawgit.com/" + user + "/Datamine.me/master/readings.json";

$.ajax({
  url: dataUrl,
  dataType: "json",
  crossDomain: true,
  success: function(data) {
    $(document).ready(function() {
      init(data);
    });
  },
  error: function(response) {
    console.log("AJAX error: " + JSON.stringify(response));
  },
  failure: function(response) {
    console.log("AJAX failure: " + JSON.stringify(response));
  }
});

function init(data) {
  var grid = createGrid(data);
  setupGrid(grid);

  createFilters();
  setupFilters(grid);

  createSorts();
  setupSorts(grid);

  createSearch()
  setupSearch(grid);
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

function createFilters() {
  var allGroups = $.unique($('[data-groups]').map(function() { return $(this).data('groups'); })).toArray();
  $('#filters').handlebars($('#filters-template'), allGroups);
}

function setupFilters(grid) {
  var filters = $('#filters-dropdown .filter');

  filters.click(function(e) {
    e.preventDefault();

    var filter = $(this);
    var group = filter.data('group');

    filters.removeClass('active');
    filter.addClass('active');

    grid.shuffle('shuffle', group);
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

function isMatch(content, terms) {
  var notFound = terms.filter(function(term) {
    return content.toLowerCase().indexOf(term.toLowerCase()) === -1;
  });

  return notFound.length === 0;
}

function executeSearch(grid, terms) {
  grid.shuffle('shuffle', function(el, shuffle) {
    if (shuffle.group !== 'all' && $.inArray(shuffle.group, el.data('groups')) === -1) {
      return false;
    }

    var content = $.trim(el.find('.card-content').text()).toLowerCase();
    return isMatch(content, terms);
  });
}

function createSearch() {
  $('#search').handlebars($('#search-template'), {});
}

function setupSearch(grid) {
  var search_form = $('#search-form');
  var search_input = search_form.find('#search-input');
  var close_button = search_form.find('.material-icons:contains("close")');

  search_form.submit(function(e) {
    e.preventDefault();

    var query = search_input.val().split(' ');
    executeSearch(grid, query);
  });

  close_button.click(function(e) {
    e.preventDefault();

    search_input.val('');
    executeSearch(grid, []);
  });
}
