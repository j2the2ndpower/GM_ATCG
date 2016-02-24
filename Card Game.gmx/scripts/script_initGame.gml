//Listeners and Events
global.events = ds_map_create();

//Networking
global.serverHost = "pounce.house";
global.serverPort = 4050;
global.connected = false;
global.connecting = false;
global.reconnect = false;
global.client = undefined;
network_set_config(network_config_connect_timeout, 1000);
//There is a bug with async connections... Leave this commented out until they fix it.
//network_set_config(network_config_use_non_blocking_socket, 1);
