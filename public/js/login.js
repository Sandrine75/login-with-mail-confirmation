'use strict';

$(function(){
  $('#login').click(login);
})

function login(e) {
  e.preventDefault();
  console.log('login');

  var username = $('#username').val();
  var pw = $('#pw').val();

  $.post('/users/login', {username: username, password: pw})
  .done(function(data){
    window.location.replace('/');
  })
  .fail(function(err){
    $('#username').val('');
    $('#pw').val('');
    swal('Bad Password:', 'Please check password or confirm email');
  });
}
