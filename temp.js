/*var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const port = 8080;

var players = [
    {
        id : 'player1',
        name : 'Player 1',
        client : ''
    },
    {
        id : 'player2',
        name : 'Player 2',
        client : ''
    }
];

var game = {
    value : 0,
    playerTurn : '',
    gameOver : false,
    message : ''
}

app.get('/', function(req, res){
    res.send('server is running');
});

io.on("connection", function (client) {
    
    // Fetch Users
    client.on("fetchAllUsers", function(id) {
        client.emit("users", {listPlayers : players});  
    });    

    client.on("choosePlayer", function(id) {
        
        if (!id)
        {
            return;
        }
        
        game.message = '';
        game.gameOver = false;

        var inGame = Object.assign({}, game, {
            gameOver : false, 
            message : "The other player have joined the game"
        })

        client.broadcast.emit("fetchStatus", { game : inGame});

        players.map(player => {
            if (player.id === id)
            {
                // Check if user is not being used
                if (player.client == "")
                {
                    player.client = client.id;
                }
            }
            return player;
        });

        io.emit("users", {listPlayers : players});
    })


    // Status
    client.on("initGame", function() {        

        var p = players.filter(function (player) {
            return player.client === client.id && player.client !== '';
        })

        if (p.length === 0)
        {
            client.emit("fetchStatus", { isPlaying : false });
        } else {
            client.emit("fetchStatus", {game, isPlaying : true});
        }

    });

    // Perform Game Action
    client.on("performAction", function(val) {

        if (game.value === 0)
        {
            game.value = val;
        } else 
        {
            var result = (parseInt(val, 10) + parseInt(game.value)) / 3;

            if (result === 1)
            {
                game.value = result;

                client.emit("fetchStatus", {game : Object.assign({}, game, {
                    gameOver : true,
                    message : 'You Won!'
                })});

                client.broadcast.emit("fetchStatus", {game : Object.assign({}, game, {
                    gameOver : true,
                    message : 'You lose!'
                })});

                return;
            } else {
                game.value = result;
            }    
        }

        io.emit("fetchStatus", {game});
    });  

    client.on("disconnect", function(){
        players.map(player => {
            if (player.client === client.id)
            {

                game = {
                    value : 0,
                    gameOver : true,
                    message : "The other player have left",
                    playerTurn : '',
                }


                player.client = '';
            }
            return player;
        });

        io.emit("fetchStatus", { game });
        io.emit("users", {listPlayers : players });
    });
});

http.listen(port, function(){
    console.log('listening on port ' + port);
});*/