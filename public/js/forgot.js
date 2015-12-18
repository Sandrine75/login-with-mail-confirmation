'use strict';

$(function(){
  $('#changePass').click(changePass);
  $('#phoneCode').click(sendCode);
})


function sendCode (e) {
  e.preventDefault();

  var username = $('#username').val();
  $.post('/users/getCode', {username: username})
  .done(function(data){
    swal(`${data.code}`)
  })
  .fail(function(err){
    swal('Phone is not registered:','ಠ_ಠ ...What on earth were you thinking? ');
  });

}



function changePass(e) {
  e.preventDefault();

  var username = $('#username').val();
  var pw1 = $('#pw1').val();
  var pw2 = $('#pw2').val();
  var phoneNumber = $('#phonenumber').val();

  if(pw1 !== pw2){
    $('#pw1').val('');
    $('#pw2').val('');
    swal('Error:', 'Passwords do not match.', 'error');
  } else {
    $.post('/users/forgotpassword', {username: username, password: pw1})
    .done(function(data){
      window.location.replace('/login');
    })
    .fail(function(err){
      swal('Error:', err, 'error');
    });
  }
}
