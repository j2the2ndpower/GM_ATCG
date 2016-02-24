var net = require('net');

var HOST = 'pounce.house';
var PORT = 4050;

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        // Write the data back to the socket, the client will receive it as data from the server
        //sock.write('You said "' + data + '"');
        
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

//    sock.write("GM:Studio-Connect");
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);
