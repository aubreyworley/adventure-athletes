$(function() {

  var profileTemplate = _.template($('#profile-template').html());

  var $profileInfo = $('#profile-info');

      $.get('/api/members/current', function(data) {
        var profile = data;

        $('#profile-info').append(members)
        console.log(profile);
      
      });
    });

