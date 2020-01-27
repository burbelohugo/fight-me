
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
      isMovingRight: false,
      health: 100
    },
    socket
  };

  players.forEach( p => socket.emit('registerPlayer', p.data));
  socket.emit('setId', id);
  players.push(player);
  players.forEach( p => p.socket.emit('registerPlayer', player.data)) // register new player
  return id;
}

const toggleMoving = (playerId, direction, move) => {
  const player = getPlayer(playerId);
  let movingDirection = "isMovingLeft";

  if(direction === 'right') {
    movingDirection = "isMovingRight";
  }

  player.data[movingDirection] = move;
}

const playerIsCloseToAttack = (x1, x2, direction) => {
  let offset = 30;
  if(direction === 'left') {
    offset = -30;
  }
  return x1 - x2 < offset;
}

const handleAttack = (playerId, direction) => {
  const attackingPlayer = getPlayer(playerId);
  const attackingPosition = attackingPlayer.data.x;
  players.forEach(player => {
    if(player.data.id !== playerId && playerIsCloseToAttack(attackingPosition, player.data.x, direction)) {
      player.data.health =- 10;
      console.log('ding')
    }
  })
}

const getPlayer = (playerId) => {
  return players.filter(p => { return p.data.id === playerId })[0];
}

setInterval(() => {
  players.forEach(player => {
    if(player.data.isMovingLeft) {
      player.data.x = player.data.x - 10;
    }
    if(player.data.isMovingRight) {
      player.data.x = player.data.x + 10;
    }
    io.emit('stateUpdate', player.data);
  });
}, (1000/60));

io.on('connection', function(socket){
  console.log('a user connected');
  const id = playerConnected(socket);

  socket.on('sending', function(data){
        io.emit('recieve', data);


        if(data=="exit"){
        	socket.disconnect( console.log('sender disconnected'));
        }
  });

  socket.on('startLeft', function(msg){
     toggleMoving(id, 'left', true);
  });

  socket.on('stopLeft', function(msg){
     toggleMoving(id, 'left', false);
  });

  socket.on('startRight', function(msg){
     toggleMoving(id, 'right', true);
  });

  socket.on('stopRight', function(msg){
     toggleMoving(id, 'right', false);
  });

  socket.on('attackRight', function(msg){
     handleAttack(id, 'right');
  });

  socket.on('attackLeft', function(msg){
     handleAttack(id, 'left');
  });


});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

server.listen(3000, function(){
  console.log('listening on *:3000');
});
