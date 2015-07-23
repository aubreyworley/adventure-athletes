$(function() {

  // `logsController` holds log functionality
  var postsController = {

  // compile underscore template
    template: _.template($('#post-template').html()),

    // get all posts
    all: function() {
      // AJAX call to server to GET /api/posts
      $.get('/api/posts', function(allPosts) {
        console.log(allPosts);
        
        // iterate through all posts
        _.each(allPosts, function(post, index) {
          console.log(post);
          
          // pass post through underscore template
          var $postHtml = $(postsController.template(post));
          console.log($postHtml);
          
          // append post HTML to page
          $('#post-list').append($postHtml);
        });
      });
    },

    // create new post
    create: function(adventureData) {
      // define object with our post data
      var postData = {adventure: adventureData};

      // AJAX call to server to POST /api/posts
      $.post('/api/posts', postData, function(newPost) {
        console.log(newPost);

        // pass post through underscore template
        var $postHtml = $(postsController.template(newPost));
        console.log($postHtml);

       // append post HTML to page
        $('#post-list').append($postHtml);
      });
    },

      update: function(postId, updatedAdventure) {
      // send PUT request to server to update post
      $.ajax({
        type: 'PUT',
        url: '/api/posts/' + postId,
        data: {
          adventure: updatedAdventure
        },
        success: function(data) {
          var updatedPost = data;

          // replace existing post in view with updated post
          var $postHtml = $(postsController.template(updatedPost));
          $('#post-' + postId).replaceWith($postHtml);
        }
      });
    },
    
    delete: function(postId) {
      // send DELETE request to server to delete post
      $.ajax({
        type: 'DELETE',
        url: '/api/posts/' + postId,
        success: function(data) {
          
          // remove deleted post from view
          $('#post-' + postId).remove();
        }
      });
    },

    // add event-handlers to posts for updating/deleting
    addEventHandlers: function() {
      $('#post-list')

        // for update: submit event on `.update-post` form
        .on('submit', '.update-post', function(event) {
          // alert("hello")
          event.preventDefault();
          
          // find the post's id (stored in HTML as `data-id`)
          var postId = $(this).closest('.post').attr('data-id');
          
          // udpate the post with form data
          var updatedAdventure = $(this).find('.adventure').val();
          console.log("UPDATED ADV", updatedAdventure)
          postsController.update(postId, updatedAdventure);
        })
        
        // for delete: click event on `.delete-post` button
        .on('click', '.delete-post', function(event) {
          event.preventDefault();

          // find the post's id
          var postId = $(this).closest('.post').attr('data-id');
          
          // delete the post
          postsController.delete(postId);
        });
    },

    setupView: function() {
      // append existing posts to view
      postsController.all();
      
      // add event-handler to new-post form
      $('#new-post').on('submit', function(event) {
        event.preventDefault();
        console.log('clicked');
        
        // grab post adventure from form
        var postAdventure = $('#adventure').val()

        // create new post
        postsController.create(postAdventure);
        
        // reset the form
        $(this)[0].reset();
      });
    }
  };
  postsController.addEventHandlers();

  postsController.setupView();

});