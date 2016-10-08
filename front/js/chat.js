$(document).ready(function() {
    $("#btn-chat").click({author: "asdf", msg: $("#btn-input")}, sendMessage);
    $("#btn-start").click({author: "auth"}, initChat);
});

function sendMessage(event) {
    var post='<li class="left clearfix"><span class="chat-img pull-left"> <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" /> </span> <div class="chat-body clearfix"> <div class="header"> <strong class="primary-font">' + event.data.author + '</strong> <small class="pull-right text-muted"> <span class="glyphicon glyphicon-time"></span>12 mins ago</small> </div> <p>' + event.data.msg + '</p> </div> </li>'

    $(".chat").append(post);
    var chat = document.getElementById("chat-body");
    chat.scrollTop = chat.scrollHeight;
}

function initChat(event) {
  $("html, body").animate({ scrollTop: $('.chat').offset().top }, 500);
  var socket = new WebSocket('ws://10.192.216.241:5000');
  socket.send("xd");
  socket.onopen = function() {
    alert("connected");
     socket.send("h a r a m b e w a s i n n o c e n t");
  }
  socket.onmessage = function(event) {
    alert("eeeeeeyyyyy");
  }
}
