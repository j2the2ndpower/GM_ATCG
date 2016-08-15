//Create Socket
if (is_undefined(global.client)) {
    global.client = network_create_socket(network_socket_tcp);
    network_set_timeout(global.client, 3000, 3000);
}

//Attempt to connect
if (!global.connected) {
    global.connecting = true;
    //var failure = network_connect_raw(global.client, network_resolve(global.serverHost), global.serverPort);
    var conn = network_connect(global.client, global.serverHost, global.serverPort);
    
    if (conn == 0) {
        //global.connected = true;
        var mapTest = ds_map_create();
        /*ds_map_add(mapTest, "tester1", "stringTest");
        ds_map_add(mapTest, "test2", 123);
        ds_map_add(mapTest, "t3", 32.14);
        ds_map_add(mapTest, "test4", true);*/
        
        script_sendMsg(nm_connect, mapTest);
    }
}
