var mongo = require('mongodb').MongoClient;
var db = undefined;
var ObjectId = require('mongodb').ObjectID;
var net = require('net');
var events = require('events');
var Message = require('./net/Message.js');
var Auth = null, Router = new events.EventEmitter(), NetFile = null, Data = null, Avatar = null; 
var clients = [];

var HOST = 'pounce.house';
var PORT = 4050;

exports.Router = Router;
exports.clients = clients;

mongo.connect('mongodb://localhost:27017/aether', function(err, conn) {
    if (!err) {
        db = conn;
        exports.db = db;
        Auth = require('./auth/Auth.js');
        NetFile = require('./net/File.js');
        Data = require('./data/Data.js');
        Avatar = require('./data/Avatar.js');
        console.log("Server connected to DB.");
    }
});

net.createServer(function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    clients.push(sock);

    //Fake being a GM Studio server
    var buffer = new Buffer("GM:Studio-Connect\0");
    console.log('SENT: ' + buffer.toString('hex'));
    sock.write(buffer);
    var waitingHandshake = true;

    sock.on('data', function(data) {
        var waitingHandshake = false;
        console.log('RECEIVED: ' + data.toString('hex'));

        if (data.length >= 12) {
            var x = data.readUInt32LE(0);
            var y = data.readUInt32LE(4);
            var size = data.readUInt32LE(8);

            if (x == 3405691582 && y == 3735924747) { waitingHandshake = true; }
        }

        if (waitingHandshake === true) {
            buffer = new Buffer([0xad, 0xbe, 0xaf, 0xde, 0xeb, 0xbe, 0x0d, 0xf0, 0x0c, 0x00, 0x00, 0x00]);
            console.log('SENT: ' + buffer.toString('hex'));
            sock.write(buffer);
        } else {
            msg = Message.read(data);
            Router.emit(msg.type, sock, msg);
        }
    });
    
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
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
