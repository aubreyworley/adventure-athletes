var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    salt = bcrypt.genSaltSync(10),
    Post = require('./post');

  var MemberSchema = new Schema({
      firstName: String,
      lastName: String,
      email: String,
      about: String,
      passwordDigest: String,
      posts: [Post.schema]
  });

  MemberSchema.statics.createSecure = function (memberData, callback) {
    var that = this;

    bcrypt.genSalt(function (err, salt) {
    bcrypt.hash(memberData.password, salt, function (err, hash) {
      console.log(hash);

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

MemberSchema.statics.authenticate = function (email, password, callback) {
  this.findOne({email: email}, function (err, user) {
    console.log(member);

    if (member === null) {
      throw new Error('Can\'t find member with email ' + email);
       } else if (member.checkPassword(password)) {
      callback(null, member);
    }
  });
};


MemberSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.passwordDigest);
};

var Member = mongoose.model('Member', MemberSchema);
module.exports = Member;