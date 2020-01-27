
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const path = require('path');
const UUID = require('uuid');
let players = [];

const playerConnected = () => {
  players.push({
    id: UUID.v4(),
    x: 0,
    y: 0
  });
}

io.on('connection', function(socket){
  console.log('a user connected');
  playerConnected();
  console.log(players)

  socket.on('sending', function(data){
        console.log(data);

        io.emit('recieve', data);


        if(data=="exit"){
        	socket.disconnect( console.log('sender disconnected'));
        }
  });

  socket.on('startLeft', function(msg){
     console.log('hello')
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
