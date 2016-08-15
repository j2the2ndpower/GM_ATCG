var net = require('net');
/*var mongo = require('mongodb').MongoClient;
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
*/

function logHeader(buffer) {
	var x = buffer.readUInt32LE(0);
	var y = buffer.readUInt32LE(4);
	var size = buffer.readUInt32LE(8);
	console.log("HEADER: x: " + x + " y: " + y + " size: " + size);
}

client = net.connect({host: '127.0.0.1', port: 6150}, () => {
	console.log('Connected to Server!');
});

dcount = 0;
client.on('data', (data) => {
	dcount++;
	logHeader(data);
	console.log("DATA:");
	console.log(data.toString('hex').substr(0, 40));

	if (dcount==1) {
	  //var buffer = new Buffer([0xbe, 0xba, 0xfe, 0xca, 0x0b, 0xb0, 0xad, 0xde, 0x10, 0x00, 0x00, 0x00, 0x5c, 0xf4, 0x19, 0x00]);
	  var buffer = new Buffer([0xbe, 0xba, 0xfe, 0xca, 0x0b, 0xb0, 0xad, 0xde, 0x10, 0x00, 0x00, 0x00, 0xa1, 0x91, 0x52, 0x00]);
	  client.write(buffer, 'UFT8', function() { console.log("Sending click event"); });
	} else if (dcount==2) {
		var buffer = new Buffer([0xde, 0xc0, 0xad, 0xde, 0x0c, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x01, 0x87, 0x01, 0x00, 0x00, 0x03, 0x01, 0x00, 0x00]);
		client.write(buffer);
	}
});
