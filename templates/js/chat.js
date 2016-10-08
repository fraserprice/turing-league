$(document).ready(function() {
    $("#main-chat").hide();

    $("#btn-chat").click({author: "asdf", msg: $("#btn-input")}, sendMessage);
    $("#btn-start").click({author: "auth"}, initChat);

    $('#btn-chat').prop('disabled', true);
    $('#btn-input').prop('disabled', true);
});

function sendMessage(event) {
    var post='<li class="left clearfix"><span class="chat-img pull-left"> <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" /> </span> <div class="chat-body clearfix"> <div class="header"> <strong class="primary-font">' + event.data.author + '</strong> <small class="pull-right text-muted"> <span class="glyphicon glyphicon-time"></span>12 mins ago</small> </div> <p>' + event.data.msg + '</p> </div> </li>'

    $(".chat").append(post);
    var chat = document.getElementById("chat-body");
    chat.scrollTop = chat.scrollHeight;
    tickResponsesLeft();
    setTimer(10);
}

function tickTimer() {
    var curr = $('#time-val').text();
    if (curr > 0) {
        setTimer(curr - 1);
    }
}

function tickResponsesLeft() {
    var curr = $('#responses-val').text();
    if (curr > 0) {
        setResponsesLeft(curr - 1);
    }

}

function setTimer(time) {
    $('#time-val').text(time);
    var percentage = time/10 * 100;
    $('#time-bar').css("width", percentage + "%");
}

function setResponsesLeft(value) {
    $('#responses-val').text(value);
    var percentage = value/10 * 100;
    $('#responses-bar').css("width", percentage + "%");
}

function initChat(event) {
  $('#btn-chat').prop('disabled', false);
  $('#btn-input').prop('disabled', false);

  $('#nickname-input').prop('disabled', true);
  $('#btn-start').prop('disabled', true);

  //colorize
  $("#chat-panel").css("background-color", "#337AB7");
  $("#chat-panel").css("border-bottom", "#337AB7");
  $(".panel").css("border-color", "#337AB7");

  $(".jumbotron").css("height", "320px");
  $("#main-chat").show(600, function() {
    $("html, body").animate({ scrollTop: $('.chat').offset().top }, 500);
  });
  
   setTimer(10);
   setResponsesLeft(10);
   setInterval(tickTimer(), 1000);

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
