var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    salt = bcrypt.genSaltSync(10),
    Post = require('./post');

  //set User Schema

  var MemberSchema = new Schema({
      firstName: String,
      lastName: String,
      email: String,
      about: String,
      passwordDigest: {type: String, minlength: 6},
      posts: [Post.schema],
  });

  //create a new user with secure hashed password
  MemberSchema.statics.createSecure = function (memberData, callback) {
    //'this' references the schema
    // stored into another variable since the context will change in nested callbacks
    var that = this;

    //hash password user enters at sign up
    bcrypt.genSalt(function (err, salt) {
    bcrypt.hash(memberData.password, salt, function (err, hash) {
      console.log(hash);

      //create the new user (save to db) with hashed password
      that.create({
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        email: memberData.email,
        about: memberData.about,
        passwordDigest: hash
      }, callback);
    });
  });
};

//authenticate member at log in
MemberSchema.statics.authenticate = function (email, password, callback) {
  //find member by email entered at log in
  this.findOne({email: email}, function (err, member) {
    console.log(member);

    if (member === null) {
      throw new Error('Can\'t find member with email ' + email);
      } else if (member.checkPassword(password)) {
          callback(null, member);
    }
  });
};

//compare password user enters with hashed password
MemberSchema.methods.checkPassword = function (password) {
  console.log("CHECKING PASSWORD", password, this.passwordDigest);
  return bcrypt.compareSync(password, this.passwordDigest);
};

//create Member Model
var Member = mongoose.model('Member', MemberSchema);
module.exports = Member;