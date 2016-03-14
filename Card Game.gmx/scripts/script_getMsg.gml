var messageBuffer = argument0;
var messageSize = argument1;
var type = 0, i;
var paramCount = 0;
var keyLengths = ds_list_create();
var valTypes = ds_list_create();
var valLengths = ds_list_create();

var keys = ds_list_create();
var vals = ds_list_create();

buffer_seek(messageBuffer, buffer_seek_start, 0);
type = buffer_read(messageBuffer, buffer_u32);
paramCount = buffer_read(messageBuffer, buffer_u32);

for (i=0; i < paramCount; i++) {
    ds_list_add(keyLengths, buffer_read(messageBuffer, buffer_u32));
    ds_list_add(valTypes, buffer_read(messageBuffer, buffer_u8));
}

for (i=0; i < paramCount; i++) {
    ds_list_add(valLengths, buffer_read(messageBuffer, buffer_u32));
}

for (i=0; i < paramCount; i++) {
    var k = buffer_read(messageBuffer, buffer_text);
    var keyName = string_copy(k, 0, keyLengths[| i]);
    ds_list_add(keys, keyName);
    buffer_seek(messageBuffer, buffer_seek_relative, -string_length(k)-1+string_length(keys[| i]));
}

for (i=0; i < paramCount; i++) {
    if (valTypes[| i] == nm_param_string) {
        var k = buffer_read(messageBuffer, buffer_text);
        ds_list_add(vals, string_copy(k, 0, valLengths[| i]));
        buffer_seek(messageBuffer, buffer_seek_relative, -string_length(k)-1+string_length(vals[| i]));
    } else {
        ds_list_add(vals, buffer_read(messageBuffer, buffer_f32));
    }
}

//create map
nMap = ds_map_create();
for (i=0; i < paramCount; i++) {
    var k = keys[| i];
    var v = vals[| i];
    ds_map_add(nMap, keys[| i], vals[| i]);
}

script_fireEvent("nm_" + string(type), nMap);
