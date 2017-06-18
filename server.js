var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const port = 8080;
let players = [];
let playerTurn;
let actionObject = {};

app.get('/', function(req, res){
    res.send('server is running');
});

var setDefaultUserTurn = function (clientId) {
    
    // Default Turn to First User
    if (!playerTurn) 
    {
        playerTurn = clientId;
    }       

}

var fetchPlayers = function (arr, message) {
    var arrPlayers = arr.map(function(player) {
        return {id : player, playerTurn};
    });

    io.emit("fetchPlayers", {players : arrPlayers, message : (message || "") });
}

var fetchPlayerAction = function () {
    io.emit("listenPlayerAction", actionObject);
}

io.on("connection", function (client) {
    
    // Make a Move
    client.on("listenPlayerAction", function() {

        fetchPlayerAction();

    })

    // Listen to a Move
    client.on("performPlayerAction", function(actionObj) {

        actionObject = actionObj;

        playerTurn = players.filter(function(player) {
            return player !==  playerTurn;
        })[0];

        // Fetch Player Action
        fetchPlayerAction();

        // Fetch Players
        fetchPlayers(players);

    });


    // Choose Player
    client.on("choosePlayerVsPlayer", function() {
        
        var clientId = client.id;

        // Set User Turn
        setDefaultUserTurn(clientId);

        // Add User
        players.push(clientId);

        // Fetch Players
        fetchPlayers(players);

    });

    // Disconnect
    client.on("disconnect", function () {
        
        if (players.indexOf(client.id) != -1)
        {
            players = [];
            playerTurn = "";
            actionObject = { value : 0};
            
            fetchPlayerAction();
            fetchPlayers(players, "The other player has left");
        }    

    });

});

http.listen(port, function(){
    console.log('listening on port ' + port);
});