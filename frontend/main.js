let socket = io ();
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext("2d");
let localId = 0;
ctx.font = "30px Arial";

let images = {
    'standing' : [ document.getElementById('standing'), document.getElementById('standing2') ],
    'walking' : [ document.getElementById('walking'), document.getElementById('walking2') ],
    'punch' : [ document.getElementById('punch') ],
    'ground' : [ document.getElementById('ground') ],
}

function keydown ( evt ) {
    if ( evt.key == 'a' )
        socket.emit('startLeft', {} )
    if ( evt.key == 'd' )
        socket.emit('startRight', {} )
    if ( evt.key == 'Enter')
        socket.emit( players[localId].flip ? 'attackLeft' : 'attackRight' )
    if ( evt.key == ' ')
        socket.emit('jump', {} )
}
function keyup ( evt ){
    if ( evt.key == 'a' )
        socket.emit('stopLeft', {} )
    if ( evt.key == 'd' )
        socket.emit('stopRight', {} )
}

document.addEventListener( 'keydown', keydown )
document.addEventListener( 'keyup', keyup )

// Game Code

let players = { }
let frame = 0;

socket.on( 'setId', id => localId = id )
socket.on ( 'registerPlayer', info => {
    players[info.id] = { ... info, ... { name : 'test', flip : false, state : 'standing' } }
    console.log( 'Recieved new player', info)
})

socket.on( 'stateUpdate', player => {
    if ( player.health < 0 )
        player.health = 0;
    if ( player.x != players[player.id].x)
        players[player.id].flip = player.x < players[player.id].x;
    players[player.id] = { ... players[player.id], ... player }
    if ( player.isMovingLeft || player.isMovingRight )
        player.state = 'walking'
    else
        player.state = 'standing'
    if ( player.id == localId && player.health == 0 ){
        document.body.style.background = 'red';
    }
})

// Game Loop

setInterval(() => {
    
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, 800, 800);
    ctx.fillStyle = "#000000"
    

    let frameNumber = frame % images['ground'].length ;
    ctx.drawImage( images['ground'][frameNumber], 0, 600 )

    let ids = Object.keys( players )
    ids.forEach( playerId => {

        let player = players[playerId]
        let frameNumber = frame % images[player.state].length ;
        
        ctx.fillStyle = "#FF0000"
        ctx.fillRect(player.x, player.y + 20, player.health, 5);
        ctx.fillStyle = "#000000"


        if ( player.flip ){
            ctx.translate(800, 0);
            ctx.scale(-1, 1);
            ctx.drawImage( images[player.state][frameNumber], 700 - player.x, player.y )
            ctx.scale(-1, 1);
            ctx.translate(-800, 0);
        }
        else {
            ctx.drawImage( images[player.state][frameNumber], player.x, player.y )
        }
        


    })

}, 1000 / 60);

// Do animation froames
setInterval( () => frame += 1, 300 )