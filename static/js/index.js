var socket;
var user;
var role;
var timer;

$(document).ready(function() {
    socket = null;
    user = "";
    role = "";

    $("#main-chat").hide();
    $("#is-bot-dialog").hide();

    $("#btn-start").click(function() {
        setNickname();
    });

    $("#btn-chat").click(function() {
        setMessage();
    });

    $("#btn-yes").click(replyYes());
    $("#btn-no").click(replyNo());

    disableChat(true);
});

$(document).keydown(function(e) {
    if(e.which == 13) {
        if (user === "") {
            setNickname();
        } else {
            setMessage();
        }
    }
});

$(window).unload(function() {
    if (socket !== null) {
        socket.emit('loss', { message : 'disconnect' });
    }
})

function sendSystemMessage(msg, color) {
    var initial = '!';
    var time = getCurrentTime();
    var post='<li class="left clearfix"><span class="chat-img pull-left"> <img src="http://placehold.it/50/' + color + '/fff&text=' + initial + '" alt="User Avatar" class="img-circle" /> </span> <div class="chat-body clearfix" style="margin-top: 12px;"> <strong class="primary-font" style="font-size: 20px">' + msg + '</strong> <small class="pull-right text-muted"> <span class="glyphicon glyphicon-time"></span>' + time + '</small> </div> </li>'

    $(".chat").append(post);
}

function setNickname() {
    var nick = $("#nickname-input").val(); 
    if (nick !== "") {
        user = nick;
        initChat(nick);
        $("#btn-input").focus();
    }
}

function setMessage() {
    var msg = $("#btn-input").val();
    if (msg !== "") {
        sendMessage($("#nickname-input").val(), msg);
    }
}

function turnTimeout() {
    socket.emit('loss', { message : 'timeout' });
    sendSystemMessage("Time limit over! YOU LOSE!", "AA2222");
    finishGame();
}

function finishGame() {
    disableChat(true);
    clearInterval(timer);
    setResponsesLeft(0);
}

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

function sendMessage(author, msg) {
    disableChat(true);    
    displayMessage(author, msg, "55C1E7");
    socket.emit('message_submitted', { user : user, message : msg });
    var curr = $('#responses-val').text();
    if (curr > 0) {
        setResponsesLeft(curr - 1);
    }

    $("#btn-input").val("");
    setTimer(20);
    clearInterval(timer);
}

function displayMessage(author, msg, color) {
    var time = getCurrentTime();
    var initial = author.substring(0,1);
    var post='<li class="left clearfix"><span class="chat-img pull-left"> <img src="http://placehold.it/50/'+ color +'/fff&text=' + initial + '" alt="User Avatar" class="img-circle" /> </span> <div class="chat-body clearfix"> <div class="header"> <strong class="primary-font">' + author + '</strong> <small class="pull-right text-muted"> <span class="glyphicon glyphicon-time"></span>' + time + '</small> </div> <p>' + msg + '</p> </div> </li>'

    $(".chat").append(post);
    var chat = document.getElementById("chat-body");
    chat.scrollTop = chat.scrollHeight;
}

function tickTimer() {
    var curr = $('#time-val').text();
    if (curr > 0) {
        setTimer(curr - 1);
    } else {
        turnTimeout();
        clearInterval(timer);
    }
}

function setTimer(time) {
    $('#time-val').text(time);
    var percentage = time/20 * 100;
    $('#time-bar').css("width", percentage + "%");
}

function replyNo() {
  socket.emit("bot_decision", { user: user, bot: false })
}

function replyYes() {
  socket.emit("bot_decision", { user: user, bot: true })
}

function setResponsesLeft(value) {
  $('#responses-val').text(value);
  var percentage = value/10 * 100;
  $('#responses-bar').css("width", percentage + "%");
  if (value <= 5 && !$("#is-bot-dialog").is(":visible") && role === "attacker") {
    $("#is-bot-dialog").show(600, "swing");
  }
  if (value == 0) {
      disableChat(true);
  }
}

function initChat(nickname) { 
  disableChat(true);

  $('#nickname-field').hide();

  $(".jumbotron").css("height", "200px");
  $(".jumbotron").css("margin-bottom", "60px");
  $("#jumbo-title").css("margin-top", "20px");

  $("#main-chat").show(600, function() {
    $("html, body").animate({ scrollTop: $('.chat').offset().top }, 500);
  });

  //Connect to socket
  socket = io.connect('http://localhost:5000/chat');

  socket.on('connect', function() {
      sendSystemMessage("Connected!", "22AA22");
  });

  socket.on('disconnect', function() {
      sendSystemMessage("Disconnected!", "AA2222");
  });

  //Send game start request
  socket.emit("start_request", { nickname: nickname });
  setResponsesLeft(10);

  //Let user know role once game starts
  socket.on('started', function(data) {
    var msg = "";
    if(data.role === "attacker") {
        msg = "Figure out if you're chatting with another human or a bot!";
        disableChat(false);
    } else {
        msg = "Convince the other person that you're a bot!";
    }
    sendSystemMessage(msg, "E0F500");
  });

  //Add received message to chat
  socket.on('message_received', function(data) {
    displayMessage("Opponent", data.message, "F5BC00");
    disableChat(false);
    startTimer();
  });

  //Tell user result of game
  socket.on('finished', function(data) {
    if(data.win) {
        sendSystemMessage("You win!", "22AA22");
    } else {
        sendSystemMessage("You lose!", "AA2222");
    }
  });
}

function startTimer() {
  setTimer(20);
  timer = setInterval(function() {
      tickTimer(); }, 1000);
}

function disableChat(disabled) {
  $('#btn-chat').prop('disabled', disabled);
  $('#btn-input').prop('disabled', disabled);
  if(disabled) {
    var placeholder = "Waiting for response..."
  } else {
    var placeholder = "Send a message..."
  }
  $('#btn-input').placeholder = placeholder;
}
