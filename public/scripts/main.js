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
    }
  };

  mainController.showCurrentMember();

});