
var app = require('express')();
var express = require('express');
var server = require('http').Server(app);
var io = require('socket.io')(server);
const path = require('path');
const UUID = require('uuid');
let players = [];

app.use(express.static('../frontend'))

const playerConnected = (socket) => {
  const id = UUID.v4();
  const player = {
    data: {
      id,
      x: 0,
      y: 0,
      isMovingLeft: false,
    },
    socket
  };

  players.forEach( p => socket.emit('registerPlayer', p.data))
  players.push(player);
  players.forEach( p => p.socket.emit('registerPlayer', p.data))

  return id;
}

const toggleMovingLeft = (playerId) => {
  const player = players.filter(p => { return p.data.id === playerId })[0]
  console.log(player)
  player.data.isMovingLeft = !player.data.isMovingLeft;
}

setInterval(() => {
  players.forEach(player => {
    if(player.data.isMovingLeft) {
      player.data.x = player.data.x + 1;
      io.emit('stateUpdate', player.data);
    }
  });
}, 1);

setInterval(() => {
  console.log(players)
}, 1000)

io.on('connection', function(socket){
  console.log('a user connected');
  const id = playerConnected(socket);
  console.log(players)

  socket.on('sending', function(data){
        console.log(data);

        io.emit('recieve', data);


        if(data=="exit"){
        	socket.disconnect( console.log('sender disconnected'));
        }
  });

  socket.on('startLeft', function(msg){
     toggleMovingLeft(id);
  });

  socket.on('stopLeft', function(msg){
     toggleMovingLeft(id);
  });


});

app.get('/', function (req, res) {
  console.log(__dirname)
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
  // res.sendfile(__dirname + '/../frontend/index.html');
});

server.listen(3000, function(){
  console.log('listening on *:3000');
});
