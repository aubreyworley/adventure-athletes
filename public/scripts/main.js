$(function() {

  // `mainController` holds shared site functionality
  var mainController = {

    // compile underscore template for nav links
    navTemplate: _.template($('#nav-template').html()),

    // get current (logged-in) user
    showCurrentMember: function() {
      // AJAX call to server to GET /api/users/current
      $.get('/api/members/current', function(member) {
        console.log(member);

        // pass current user through template for nav links
        $navHtml = $(mainController.navTemplate({currentMember: member}));

        // append nav links HTML to page
        $('#nav-links').append($navHtml);
      });
    },

    // mapbox script
    <script>
L.mapbox.accessToken = 'pk.eyJ1IjoiYXdvcmxleSIsImEiOiIxNGRlYmM2ZmM0YmMxY2VlZjQ4NTMyY2Q4OWQ0M2I0OSJ9.pIOJ95hk0i-6hzOvqhU7zw';
var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([40, -74.50], 9);
</script>

  };


mainController.showCurrentMember();

});