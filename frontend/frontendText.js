import express from 'express';


let application = express ();
let port = 3000;

application.use( '/', express.static('.') )

application.listen( port, () => console.log('online') )