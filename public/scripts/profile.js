$(function() {

  // `membersController` holds members functionality
  var membersController = {

    // compile underscore templates
    template: _.template($('#member-template').html()),
    postTemplate: _.template($('#member-post-template').html()),

    // get current (logged-in) member
    show: function() {
      // AJAX call to server to GET /api/members/current
      $.get('/api/members/current', function(member) {
        console.log(member);

        // pass member through profile template
        $memberHtml = $(membersController.template({
          currentMember: member
        }));

        // append member HTML to page
        $('#show-member').append($memberHtml);

        // iterate through member's posts
        _.each(member.posts, function(post, index) {
          console.log(post);

          // pass post through underscore template
          $postHtml = $(membersController.postTemplate(post));

          // append member HTML to page
          $('#member-post-list').append($postHtml);
        });
      });
    },


    // create new post for current member
    createPost: function(adventureData) {
      // define object with our post data
      var postData = {
        adventure: adventureData
      };

      // AJAX call to server to POST /api/members/current/posts
      $.post('/api/members/current/posts', postData, function(newPost) {
        console.log(newPost);

        // pass post through underscore template
        var $postHtml = $(membersController.postTemplate(newPost));
        console.log($postHtml);

        // append post HTML to page
        $('#member-post-list').append($postHtml);
      });
    },

    setupView: function() {
      // get current member
      membersController.show();

      // add submit event on new post form
      $('#new-post').on('submit', function(event) {
        event.preventDefault();

        // grab post adventure from form
        var postAdventure = $('#adventure').val();

        // create new post
        membersController.createPost(postAdventure);

        // reset the form
        $(this)[0].reset();
      });
    }
  };

  membersController.setupView();

});

// create profile page for current member
$function() {

profileTemplate = _.template($('#profile-template').html());

// define object with our sign up data
var $profile = $('#profile');

$.get('/api/member', function(data) {
  var member = data;

  _.each(members, function(member, index) {
    var $member = $(profileTemplate(member));
    $member.attr('data-index', index);
    $profile.append($member);
  });

});

});