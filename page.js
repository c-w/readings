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
  $('#content').handlebars($('#content-template'), data);

  createFilters();
  setupFilters();
}

function createFilters() {
  var allGroups = $.unique($('[data-groups]').map(function() { return $(this).data('groups'); })).toArray();
  $('#filters').handlebars($('#filters-template'), allGroups);
}

function setupFilters() {
  var items = $('#content .row');
  var filters = $('#filters-dropdown .filter');

  items.shuffle({
    itemSelector: '.card'
  });

  filters.click(function(e) {
    e.preventDefault();

    var filter = $(this);
    var group = filter.data('group');

    filters.removeClass('active');
    filter.addClass('active');

    items.shuffle('shuffle', group);
  });
}
