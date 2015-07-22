$(function() {

  var postsController = {
    template: _.template($('#post-template').html()),

    // pass each post object through template and append to view
    render: function(postObj) {
      var $postHtml = $(postsController.template(postObj));
      $('#post-list').append($postHtml);
    },

    all: function() {
      // send GET request to server to get all posts
      $.get('/api/posts', function(data) {
        var allPosts = data;
        console.log(allPosts);
        
        // iterate through each post
        _.each(allPosts, function(post) {
          postsController.render(post);
          });
        
        
        // add event-handers for updating/deleting
        postsController.addEventHandlers();
      });
    },

    create: function(newAdventure) {
      var postData = {adventure: newAdventure};
      console.log(postData)
      
      // send POST request to server to create new post
      $.post('/api/posts', postData, function(data) {
        var newPost = data;
        postsController.render(newPost);  
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
          event.preventDefault();
          
          // find the post's id (stored in HTML as `data-id`)
          var postId = $(this).closest('.post').attr('data-id');
          
          // udpate the post with form data
          var updatedAdventure = $(this).find('.updated-adventure').val();
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
        console.log('clicked')
        
        // create new post with form data
        var newAdventure = $('#new-adventure').val()
        console.log(newAdventure)
        postsController.create(newAdventure);
        
        // reset the form
        $(this)[0].reset();
        $('#new-adventure').focus();
      });
    }
  };

  postsController.setupView();

});