var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    session = require('express-session')
    mongoose = require('mongoose');

//mongoose
mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
   'mongodb://localhost/adventure-athletes'
);

// API

// get all posts
app.get('/api/posts', function (req, res) {
  // find all posts in db
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

  // save new post in db
  newPost.save(function (err, savedPost) {
    res.json(savedPost);
  });
});

// get one post 
app.get('/api/posts/:id', function (req, res) {
  // set the value of the id
  var targetId = req.params.id;

  // find post in db by id
  Post.findOne({_id: targetId}, function (err, foundPost) {
    res.json(foundPost);
  });
});

// var Post = require('.models/post');



// middleware
app.use(bodyParser.urlencoded({extended: true}));


// ROOT ROUTES

// serve js and css files from public folder
app.use(express.static(__dirname + '/public'));

var posts = [
  {
    adventure: "Marin Headlands"
  }
];

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
app.get('/signup', function (req, res) {
  res.send('coming soon');
});

// listen on port 3000
app.listen(process.env.PORT || 3000);