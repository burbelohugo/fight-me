let socket = io ();
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext("2d");

let images = {
    'standing' : document.getElementById('standing')
}

let singleActions = {
    'w' : 'jump',
    's' : 'crouch',
    ' ' : 'jump',
    'Enter' : 'attack'
}
let continuousActions = {
    'a' : 'left',
    'd' : 'right',
}

function keydown ( evt ) {
    if ( singleActions[evt.key] )
        socket.emit('doAction', { 'action' : singleActions[evt.key] } )
    if ( continuousActions[evt.key] )
        socket.emit('startAction', { 'action' : continuousActions[evt.key] } )
}
function keyup ( evt ){
    if ( continuousActions[evt.key] )
        socket.emit('stopAction', { 'action' : continuousActions[evt.key] } )
}

document.addEventListener( 'keydown', keydown )
document.addEventListener( 'keyup', keyup )

// Game Code

let players = []

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
    
    ctx.drawImage( images['standing'], 100, 100 )
    

}, 1000 / 60);