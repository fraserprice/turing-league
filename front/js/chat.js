$(document).ready(function() {
    $("#btn-chat").click({author: "asdf", msg: $("#btn-input").text}, sendMessage);
    $('#btn-chat').prop('disabled', true);
    $("#btn-start").click(function() {
        $("html, body").animate({ scrollTop: $('.chat').offset().top }, 500);
        startChat();
    });
});

function sendMessage(event) {
    var post='<li class="left clearfix"><span class="chat-img pull-left"> <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" /> </span> <div class="chat-body clearfix"> <div class="header"> <strong class="primary-font">' + event.data.author + '</strong> <small class="pull-right text-muted"> <span class="glyphicon glyphicon-time"></span>12 mins ago</small> </div> <p>' + event.data.msg + '</p> </div> </li>'

    $(".chat").append(post);
    var chat = document.getElementById("chat-body");
    chat.scrollTop = chat.scrollHeight;
}

function startChat() {
    $('#btn-chat').prop('disabled', false);

    //colorize
    $("#chat-panel").css("background-color", "#337AB7");
    $("#chat-panel").css("border-bottom", "#337AB7");
    $(".panel").css("border-color", "#337AB7");
}
