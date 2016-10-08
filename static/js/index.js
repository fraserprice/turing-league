var socket;

$(document).ready(function() {
    $("#btn-chat").click({author: "asdf", msg: $("#btn-input")}, sendMessage);
    $("#btn-start").click({nickname: $("#nickname-input")}, initChat);
    $("#btn-yes").click(replyYes);
    $("btn-no").click(replyNo);

    $('#btn-chat').prop('disabled', true);
    $('#btn-input').prop('disabled', true);
    $("#main-chat").hide();
    $("#is-bot-dialog").hide();
});

function getCurrentTime() {
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if(hour.toString().length == 1) {
        hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        second = '0'+second;
    }   
    var time = hour + ":" + minute + ":" + second;
    return time;
}

function sendMessage(event) {
    socket.emit('message_submitted', { message: "TODO"});
    var time = getCurrentTime();
    var initial = event.data.author.substring(0,1);
    var post='<li class="left clearfix"><span class="chat-img pull-left"> <img src="http://placehold.it/50/55C1E7/fff&text=' + initial + '" alt="User Avatar" class="img-circle" /> </span> <div class="chat-body clearfix"> <div class="header"> <strong class="primary-font">' + event.data.author + '</strong> <small class="pull-right text-muted"> <span class="glyphicon glyphicon-time"></span>' + time + '</small> </div> <p>' + event.data.msg + '</p> </div> </li>'

    $(".chat").append(post);
    var chat = document.getElementById("chat-body");
    chat.scrollTop = chat.scrollHeight;

    var curr = $('#responses-val').text();
    if (curr > 0) {
        setResponsesLeft(curr - 1);
    }

    setTimer(10);
}

function tickTimer() {
    var curr = $('#time-val').text();
    if (curr > 0) {
        setTimer(curr - 1);
    }
}

function setTimer(time) {
    $('#time-val').text(time);
    var percentage = time/10 * 100;
    $('#time-bar').css("width", percentage + "%");
}

function replyNo() {
  socket.emit("bot_decision", { bot: false })
}

function replyYes() {
  socket.emit("bot_decision", { bot: true })
}

function setResponsesLeft(value) {
  $('#responses-val').text(value);
  var percentage = value/10 * 100;
  $('#responses-bar').css("width", percentage + "%");
  if (value <= 5 && !$("#is-bot-dialog").is(":visible")) {
    $("#is-bot-dialog").show(600, "swing");
  }
}

function initChat(event) {
  $('#btn-chat').prop('disabled', false);
  $('#btn-input').prop('disabled', false);
  $('#nickname-input').prop('disabled', true);
  $('#btn-start').prop('disabled', true);

  $("#chat-panel").css("background-color", "#337AB7");
  $("#chat-panel").css("border-bottom", "#337AB7");
  $(".panel").css("border-color", "#337AB7");

  $(".jumbotron").css("height", "320px");
  $("#main-chat").show(600, function() {
    $("html, body").animate({ scrollTop: $('.chat').offset().top }, 500);
  });

  //Connect to socket
  socket = io.connect('http://localhost:5000/chat');

  //Send game start request
  socket.emit("start_request", { nickname: event.data.nickname });
  setResponsesLeft(10);

  //Let user know role once game starts
  socket.on('started', function(data) {
    $('#server-message').text('Your role: ${data.role}');
  });

  //Add received message to chat
  socket.on('message_received', function(data) {
    $(".chat").append(data.message);
    startTimer();
  });

  //Tell user result of game
  socket.on('finished', function(data) {
    if(data.win) {
      $(".chat").append("YOU WIN!");
    } else {
      $(".chat").append("YOU LOSE!");
    }

  });
}

function startTimer() {
  setTimer(10);
  setTimeout(function() {
    setInterval(tickTimer(), 1000);
  }, 3000);
}
