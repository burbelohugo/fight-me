let socket = io ();
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext("2d");
ctx.font = "30px Arial";

let images = {
    'standing' : [ document.getElementById('standing'), document.getElementById('standing2') ],
    'walking' : [ document.getElementById('walking'), document.getElementById('walking2') ],
    'punch' : [ document.getElementById('punch') ]
}

function keydown ( evt ) {
    if ( evt.key == 'd' )
        socket.emit('startLeft', {} )
}
function keyup ( evt ){
    if ( evt.key == 'd' )
        socket.emit('stopLeft', {} )
}

document.addEventListener( 'keydown', keydown )
document.addEventListener( 'keyup', keyup )

// Game Code

let players = [{ name : 'test', x : 100, y : 100, state : 'punch' }]
let frame = 0;

socket.on ( 'registerPlayer', info => {
    players[info.id] = info
})

socket.on( 'stateUpdate', data => {
    data.players.forEach( player => {
        players[player.id] = { ... players[player.id], ... player }
    })
})

// Game Loop

setInterval(() => {
    
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, 800, 800);
    ctx.fillStyle = "#000000"
    
    players.forEach( player => {

        let frameNumber = frame % images[player.state].length ;

        ctx.fillText(player.name, player.x + 20, player.y )
        ctx.drawImage( images[player.state][frameNumber], player.x, player.y )

    })

}, 1000 / 60);

// Do animation froames
setInterval( () => frame += 1, 300 )