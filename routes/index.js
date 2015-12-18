'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {title: 'Auth'});
});

router.get('/register', function(req, res) {
  res.render('register', {title: 'Register'});
});

router.get('/login', function(req, res) {
  res.render('login', {title: 'Login'});
});
router.get('/confirmed', function(req, res) {
  res.render('confirmed');
});
router.get('/forgotpassword', function(req, res) {
  res.render('forgotpassword');
});

module.exports = router;
