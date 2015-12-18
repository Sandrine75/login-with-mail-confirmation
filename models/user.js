'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');

var User;

var userSchema = Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailed:  { type:Boolean, default: false},
  phone:    { type:String, required:true }
});

userSchema.methods.token = function() {
  var payload = {
    username: this.username,
    _id: this._id
  };
  var secret = 'secret';
  var token = jwt.encode(payload, secret);
  return token;
};

userSchema.statics.register = function(user, cb) {
  console.log('user in user schema',user);
  var username = user.username;
  var password = user.password;
  var phone = user.phone;
  User.findOne({username: username}, function(err, user){
    if(err || user) return cb(err || 'Username already taken.');
    bcrypt.genSalt(13, function(err1, salt) {
      bcrypt.hash(password, salt, function(err2, hash) {
        if(err1 || err2) return cb(err1 || err2);

        var newUser = new User(newUser);
        newUser.username = username;
        newUser.password = hash;
        newUser.phone = phone;
        console.log('new user',newUser);
        newUser.save(function(err, savedUser){
          console.log('saved user',savedUser);
          if(err) console.log(err);
          savedUser.password = null;
          cb(err, savedUser);
        });
      });
    });
  });
};

userSchema.statics.authenticate = function(inputUser, cb){
  User.findOne({username: inputUser.username}, function(err, dbUser) {
    if(err || !dbUser) return cb(err || 'Incorrect username or password.');
    if(err || !dbUser.emailed) return cb(err || 'Email not confirmed!');
    bcrypt.compare(inputUser.password, dbUser.password, function(err, isGood){
      if(err || !isGood) return cb(err || 'Incorrect username or password.');
      dbUser.password = null;
      cb(null, dbUser);
    });
  });
};

User = mongoose.model('User', userSchema);
module.exports = User;
