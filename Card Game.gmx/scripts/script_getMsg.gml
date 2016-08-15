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
    var start = buffer_tell(messageBuffer);
    var k = buffer_read(messageBuffer, buffer_text);
    var stop = buffer_tell(messageBuffer);
    var rewind = -(stop - start);
    
    var keyName = string_copy(k, 0, keyLengths[| i]);
    ds_list_add(keys, keyName);
    buffer_seek(messageBuffer, buffer_seek_relative, rewind + keyLengths[| i]);
}

for (i=0; i < paramCount; i++) {
    if (valTypes[| i] == nm_param_string) {
        var start = buffer_tell(messageBuffer);
        var k = buffer_read(messageBuffer, buffer_text);
        var stop = buffer_tell(messageBuffer);
        var rewind = -(stop - start);
    
        ds_list_add(vals, string_copy(k, 0, valLengths[| i]));
        buffer_seek(messageBuffer, buffer_seek_relative, rewind + valLengths[| i]);
    } else if (valTypes[| i] == nm_param_binary) {
        var binData = buffer_create(valLengths[| i], buffer_fixed, 1);
        buffer_copy(messageBuffer, buffer_tell(messageBuffer), valLengths[| i], binData, 0);
        ds_list_add(vals, binData);
        buffer_seek(messageBuffer, buffer_seek_relative, valLengths[| i]);
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
