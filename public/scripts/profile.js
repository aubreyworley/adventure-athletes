$(function() {

  // `membersController` holds users functionality
  var membersController = {

    // compile underscore templates
    template: _.template($('#member-template').html()),
    postTemplate: _.template($('#member-post-template').html()),

    // get current (logged-in) member
    show: function() {
      // AJAX call to server to GET /api/users/current
      $.get('/api/members/current', function(member) {
        console.log(member);

        // pass member through profile template
        $memberHtml = $(membersController.template({currentMember: member}));

        // append user HTML to page
        $('#show-member').append($memberHtml);

        // iterate through user's logs
        _.each(member.logs, function(log, index) {
          console.log(log);

          // pass log through underscore template
          $postHtml = $(membersController.postTemplate(post));

          // append log HTML to page
          $('#member-post-list').append($postHtml);
        });
      });
    },

    // create new log for current user
    createPost: function(typeData, caloriesData) {
      // define object with our log data
      var postData = {adventure: adventureData};
      
      // AJAX call to server to POST /api/users/current/logs
      $.post('/api/members/current/posts', postData, function(newPost) {
        console.log(newLog);
        
        // pass log through underscore template
        var $postHtml = $(membersController.postTemplate(newPost));
        console.log($postHtml);

        // append log HTML to page
        $('#member-post-list').append($postHtml);
      });
    },

    setupView: function() {
      // get current user
      membersController.show();

      // add submit event on new log form
      $('#new-post').on('submit', function(event) {
        event.preventDefault();
        
        // grab log type and calories from form
        var postAdventure = $('#adventure').val();

        // create new log
        membersController.createPost(postAdventure);

        // reset the form
        $(this)[0].reset();
      });
    }
  };

  membersController.setupView();

});