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

//GUI
window_set_rectangle(0, 0, display_get_width(), display_get_height());
display_set_gui_size(display_get_width(), display_get_height());
global.uiFocus = noone;

//Player
global.player = undefined;
global.dSprites = ds_map_create();
global.waitingSpriteData = false;


