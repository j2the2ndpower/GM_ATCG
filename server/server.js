var mongo = require('mongodb').MongoClient;
var db = undefined;
var ObjectId = require('mongodb').ObjectID;
var net = require('net');
var Message = require('./net/Message.js');
var Auth = null, Router = null; 

var HOST = 'pounce.house';
var PORT = 4050;

mongo.connect('mongodb://localhost:27017/aether', function(err, conn) {
    if (!err) {
        db = conn;
        Auth = require('./auth/Auth.js')(db);
        Router = require('./net/Router.js')(Auth);
        console.log("Server connected to DB.");
    }
    
});

net.createServer(function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    sock.on('data', function(data) {
        msg = Message.read(data); 
        console.log('RECEIVED: ');
        Router.process(sock, msg);
    });
    
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });

    sock.on('connect', function(data) {
        console.log('CONNECT: ' + data);
    });

    sock.on('end', function(data) {
        console.log('END: ' + data);
    });

    sock.on('timeout', function(data) {
        console.log('TIMEOUT: ' + data);
    });

    sock.on('drain', function(data) {
        console.log('DRAIN: ' + data);
    });

    sock.on('error', function(data) {
        console.log('ERROR: ' + data);
    });
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);
