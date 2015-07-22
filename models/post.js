var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    adventure: String
});

// create and export Log model
var Post = mongoose.model('Post', PostSchema);

module.exports = Post;