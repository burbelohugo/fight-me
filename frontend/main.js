let socket = io ();
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext("2d");

let commandMap = {
    'w' : 'jump',
    's' : 'crouch',
    'a' : 'left',
    'd' : 'right',
    ' ' : 'jump',
    'Enter' : 'attack'
}

function keydown ( evt ) {
    if ( commandMap[evt.key] )
        socket.emit('doAction', { 'action' : commandMap[evt.key] } )
}
function keyup ( evt ){
}

document.addEventListener( 'keydown', keydown )
document.addEventListener( 'keyup', keyup )
