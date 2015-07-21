var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  Post = require('models/post');
  Member = require('./models/member'),
  mongoose = require('mongoose'),
  session = require('express-session');

//mongoose
mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/adventure-athletes'
);

// middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'SuperSecretCookie',
  cookie: { maxAge: 60000 }
}));

// middleware to manage sessions
app.use('/', function (req, res, next) {
  // saves userId in session for logged-in user
  req.login = function (user) {
    req.session.userId = user.id;
  };

  // finds user currently logged in based on `session.userId`
  req.currentUser = function (callback) {
    User.findOne({_id: req.session.userId}, function (err, user) {
      req.user = user;
      callback(null, user);
    });
  };

    // destroy `session.userId` to log out user
  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  };

  next();
});

// STATIC ROUTES

// homepage
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

// profile page
app.get('/profile', function (req, res) {
  // check for current (logged-in) user
  req.currentUser(function (err, user) {
    // show profile if logged-in user
    if (user) {
      res.sendFile(__dirname + '/public/views/profile.html');
    // redirect if no user logged in
    } else {
      res.redirect('/');
    }
  });
});

// create new user with secure password
app.post('/users', function (req, res) {
  var newUser = req.body.user;
  User.createSecure(newUser, function (err, user) {
    // log in user immediately when created
    req.login(user);
    res.redirect('/profile');
  });
});

// authenticate user and set session
app.post('/login', function (req, res) {
  var userData = req.body.user;
  User.authenticate(userData.email, userData.password, function (err, user) {
    req.login(user);
    res.redirect('/profile');
  });
});

// log out user (destroy session)
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});



// API

// get all posts
app.get('/api/posts', function(req, res) {
  // find all posts in db
  Post.find(function(err, posts) {
    res.json(posts);
  });
});

// create new post
app.post('/api/posts', function(req, res) {
  // create new post with form data (`req.body`)
  var newPost = new Post({
    adventure: req.body.adventure
  });

  // save new post in db
  newPost.save(function(err, savedPost) {
    res.json(savedPost);
  });
});

// get one post 
app.get('/api/posts/:id', function(req, res) {
  // set the value of the id
  var targetId = req.params.id;

  // find post in db by id
  Post.findOne({
    _id: targetId
  }, function(err, foundPost) {
    res.json(foundPost);
  });
});

// update post
app.put('/api/posts/:id', function(req, res) {
  // set the value of the id
  var targetId = req.params.id;

  // find post in db by id
  Post.findOne({
    _id: targetId
  }, function(err, foundPost) {
    // update the post's adventure
    foundPost.adventure = req.body.adventure;

    // save updated post in db
    foundPost.save(function(err, savedPost) {
      res.json(savedPost);
    });
  });
});

// delete post
app.delete('/api/posts/:id', function(req, res) {
  // set the value of the id
  var targetId = req.params.id;

  // find post in db by id and remove
  Post.findOneAndRemove({
    _id: targetId
  }, function(err, deletedPost) {
    res.json(deletedPost);
  });
});

// ROOT ROUTES

var posts = [{
  adventure: "Marin Headlands"
}];

// set up root route to respond with index.html
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

// set up root route to respond with profile.html
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/views/profile.html');
});

// set up route for /users JSON
app.get('/members', function(req, res) {
  res.json(members);
});

// signup route with placeholder response
app.get('/signup', function(req, res) {
  res.send('coming soon');
});

// listen on port 3000
app.listen(process.env.PORT || 3000);