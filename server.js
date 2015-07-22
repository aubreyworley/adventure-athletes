var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    bcrypt = require('bcrypt'),
    salt = bcrypt.genSaltSync(10),
    session = require('express-session');

// mongoose models
var Post = require('./models/post');
var Member = require('./models/member');

// connect to mongodb
mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/adventure-athletes'
);

// middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'SuperSecretCookie',
  cookie: { maxAge: 60000 }
}));

// middleware to manage sessions
app.use('/', function (req, res, next) {
  // saves memberId in session for logged-in member
  req.login = function (member) {
    req.session.memberId = member.id;
  };

  // finds member currently logged in based on `session.memberId`
  req.currentMember = function (callback) {
    Member.findOne({_id: req.session.memberId}, function (err, member) {
      req.member = member;
      callback(null, member);
    });
  };

    // destroy `session.memberId` to log out member
  req.logout = function () {
    req.session.memberId = null;
    req.member = null;
  };

  next();
});

// STATIC ROUTES

// set up root route to respond with index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

// profile page
app.get('/profile', function (req, res) {
  // check for current (logged-in) member
  req.currentMember(function (err, member) {
    // show profile if logged-in member
    if (member) {
      res.sendFile(__dirname + '/public/views/profile.html');
    // redirect if no member logged in
    } else {
      res.redirect('/');
    }
  });
});

// AUTH ROUTES (SIGN UP, LOG IN, LOG OUT)

// create new member with secure password
app.post('/members', function (req, res) {
  var newMember = req.body.member;
  Member.createSecure(newMember, function (err, member) {
    // log in member immediately when created
    req.login(member);
    res.redirect('/profile');
  });
});

// authenticate member and set session
app.post('/login', function (req, res) {
  var memberData = req.body.member;
  Member.authenticate(memberData.email, memberData.password, function (err, member) {
    req.login(member);
    res.redirect('/profile');
  });
});

// log out member (destroy session)
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


// API ROUTES

// show current member
app.get('/api/members/current', function (req, res) {
  // check for current (logged-in) member
  req.currentMember(function (err, member) {
    res.json(member);
  });
});

// create new post for current member
app.post('/api/members/current/posts', function (req, res) {
  // create new post with form data (`req.body`)
  var newPost = new Post({
    adventure: req.body.adventure
  });

  // save new post
  newPost.save();

  // find current member
  req.currentMember(function (err, member) {
    // embed new post in member's posts
    member.posts.push(newPost);
    // save member (and new post)
    member.save();
    // respond with new post
    res.json(newPost);
  });
});

// show all posts
app.get('/api/posts', function (req, res) {
  Post.find(function (err, posts) {
    res.json(posts);
  });
});

// create new post
app.post('/api/posts', function (req, res) {
  // create new post with form data (`req.body`)
  var newPost = new Post({
    adventure: req.body.adventure
  });

  // save new post
  newPost.save(function (err, savedPost) {
    res.json(savedPost);
  });
});









 





 
// // get all posts
// app.get('/api/posts', function(req, res) {
//   // find all posts in db
//   Post.find(function(err, posts) {
//     res.json(posts);
//   });
// });

// // get one post 
// app.get('/api/posts/:id', function(req, res) {
//   // set the value of the id
//   var targetId = req.params.id;

//   // find post in db by id
//   Post.findOne({
//     _id: targetId
//   }, function(err, foundPost) {
//     res.json(foundPost);
//   });
// });

// // update post
// app.put('/api/posts/:id', function(req, res) {
//   // set the value of the id
//   var targetId = req.params.id;

//   // find post in db by id
//   Post.findOne({
//     _id: targetId
//   }, function(err, foundPost) {
//     // update the post's adventure
//     foundPost.adventure = req.body.adventure;

//     // save updated post in db
//     foundPost.save(function(err, savedPost) {
//       res.json(savedPost);
//     });
//   });
// });


// set up route for /members JSON
// app.get('/members', function(req, res) {
//   res.json(members);
// });

// // signup route with placeholder response
// app.get('/signup', function(req, res) {
//   res.send('coming soon');
// });












// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('server started on localhost: 3000');
});