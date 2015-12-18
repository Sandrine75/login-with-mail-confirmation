'use strict';

var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var client = new twilio.RestClient('AC85f1af96898de7c1e2cc18cec27af1cb', '349813a75351edc2578f1eaf657a43e6');
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');

var User = require('../models/user');

//email confrimation
var Mailgun = require('mailgun').Mailgun;
var mg = new Mailgun('key-883c7d9304ab524e05c00bacdd69af09');
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'secret';

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}


function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}


// USERS

// register a new user
router.post('/register', function(req, res) {
  console.log(req.body);

  User.register(req.body, function(err, savedUser){
    var date = new Date();
    var hours = date.getHours();
    var userpacket =  encrypt(`${req.body.username} ${hours}`);
    console.log(userpacket);

    mg.sendText('sender@example.com',
       [`${req.body.username}`],
       `http://localhost:3000/users/confirm/${userpacket}`,
       'Please click the link above to register!',
       function(err) {
         if(err) console.log(err)
         else console.log('Sucess');
       });
    res.status(err ? 400 : 200).send(err || savedUser);

  });
});

router.post('/login', function(req, res) {
  User.authenticate(req.body, function(err, user){
    if(err || !user) {
      res.status(400).send(err);
    } else {
      var token = user.token();
      console.log('token:', token);
      res.cookie('token', token);
      res.send(user);
    }
  });
});


router.get('/confirm/:token',function (req, res) {
var cypher = req.params.token;
var decrypted =  decrypt(cypher).split(' ');
var date = new Date();
var currentHour = date.getHours();
console.log('senthour', decrypted[1]);
console.log('currentHour', currentHour);

if(decrypted[1] == currentHour){

  var user = decrypted[0];
  User.findOneAndUpdate({username:user},{emailed:true}, function (err , user) {
    if(err) console.log(err);
    res.send('email was regiserted!');
  })
}else{
  res.send('email was regiserted too late!');
  console.log('email was regiserted too late!');
}


})


router.post('/getCode', function (req, res) {
  console.log(req.body);
  var date = new Date();
  var hour = date.getHours();
  // this should totaly be bcrtpy and then send back the password
  var password = encrypt(`secret ${hour}`);
  console.log(password);

  User.findOneAndUpdate({username:req.body.username}, {password:password}, function (err, founduser) {
    if (err) console.log(err);
    if(founduser) console.log('Ahoy here be the user!',founduser);
    var phoneNumber = founduser.phone;
    console.log('this is the new password',password);
    client.sendSms({
    to:`${Number(phoneNumber)}`,
    from:'8146193816',
    body:`${password}`
}, function(error, message) {
    if (!error) {
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);
        console.log('Message sent on:');
        console.log(message.dateCreated);
    } else {
      console.log(error);
        console.log('Oops! There was an error.');
    }
});

})



})



router.post('/logout', function(req, res) {
  res.clearCookie('username');
  res.clearCookie('userId');
  res.clearCookie('token');
  res.send();
})

module.exports = router;
