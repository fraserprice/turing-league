var socket;

$(document).ready(function() {

    $("#btn-chat").click({author: "asdf", msg: $("#btn-input")}, sendMessage);
    $("#btn-start").click({author: "auth"}, initChat);

    $('#btn-chat').prop('disabled', true);
    $('#btn-input').prop('disabled', true);
});

function sendMessage(event) {
    socket.emit('message_submitted', { message: "TODO"});

    var post='<li class="left clearfix"><span class="chat-img pull-left"> <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" /> </span> <div class="chat-body clearfix"> <div class="header"> <strong class="primary-font">' + event.data.author + '</strong> <small class="pull-right text-muted"> <span class="glyphicon glyphicon-time"></span>12 mins ago</small> </div> <p>' + event.data.msg + '</p> </div> </li>'

    $(".chat").append(post);
    var chat = document.getElementById("chat-body");
    chat.scrollTop = chat.scrollHeight;
}

function initChat(event) {
  $('#btn-chat').prop('disabled', false);
  $('#btn-input').prop('disabled', false);

  $("#chat-panel").css("background-color", "#337AB7");
  $("#chat-panel").css("border-bottom", "#337AB7");
  $(".panel").css("border-color", "#337AB7");

  $("html, body").animate({ scrollTop: $('.chat').offset().top }, 500);
  
  socket = io('http://localhost:5000');
  socket.emit("start_request", { nickname: "TODO" });

  socket.on('started', function(data) {
    var role = "TODO";
  });

  socket.on('message_request', function(data) {
    var timeout = "TODO";
  });

  socket.on('message_received', function(data) {
    $(".chat").append("TODO");
  });

  socket.on('finished', function(data) {
    $(".chat").append("TODO");
  });
}
