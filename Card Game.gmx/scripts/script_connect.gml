//Create Socket
if (is_undefined(global.client)) {
    global.client = network_create_socket(network_socket_tcp);
    network_set_timeout(global.client, 3000, 3000);
}

//Attempt to connect
if (!global.connected) {
    global.connecting = true;
    var failure = network_connect_raw(global.client, network_resolve(global.serverHost), global.serverPort);
    
    if (!failure) {
        global.connected = true;
    }
    global.connecting = !global.connected;
}
