var usersUrl = "/leaderboards/users"

$(document).ready(function() {
    fetchDatabase();
});

function fetchDatabase() {
    var res = httpGet(usersUrl);
    var db = JSON.parse(res);

    for (var i = 1; i <= 10; i++) {
        addRecord(i, "asdf", 55);
    }
}

function addRecord(rank, name, points) {
    var id = "";
    if (rank === 1) {
        id = 'id = "score-first"';
    } else if (rank === 2) {
        id = 'id = "score-second"';
    } else if (rank === 3) {
        id = 'id = "score-third"';
    } 

    var template = ' <div class="row score-row"' + id + '> <div class="col-xs-1 score-rank text-center"> ' + rank + ' </div> <div class="col-xs-10 score-name"> ' + name + ' </div> <div class="col-xs-1 score-points"> ' + points + ' </div> </div> '
    $("#user-leaderboards").append(template);
}

function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
