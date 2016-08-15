/*A network message
 *HEADER===========================================
 *MESSAGE_TYPE           unsigned 32bit int (4bytes)
 *MESSAGE_PARAM_COUNT    unsigned 32bit int (4bytes)
 *MESSAGE_PARAMS:
 *  PARAM_NAME_LENGTH    unsigned 32bit int (4bytes)  xMessage_Param_Count
 *  PARAM_TYPE           unsigned 32bit int (4bytes)  xMessage_Param_Count  [nm_param_*]
 *  PARAM_VALUE_LENGTH   unsigned 32bit int (4bytes)  xMessage_Param_Count
 *DATA=============================================
 *MESSAGE_PARAM_NAMES    (defined above)              xMessage_Param_Count
 *MESSAGE_PARAM_VALUES   (defined above)              xMessage_Param_Count
*/

var message_type = argument0;
var message_params = argument1;
var keyLengths = ds_list_create();
var keyNames = ds_list_create();
var valueLengths = ds_list_create();
var valueTypes = ds_list_create();
var values = ds_list_create();
var size = 8;

if (!is_undefined(global.client)) {
    //build message
    if (!ds_exists(message_params, ds_type_map)) {
        message_params = ds_map_create();
    }    
    
    var buffer = buffer_create(1, buffer_grow, 1);
    buffer_seek(buffer, buffer_seek_start, 0);
    buffer_write(buffer, buffer_u32, message_type);
    buffer_write(buffer, buffer_u32, ds_map_size(message_params));
    size += (ds_map_size(message_params)*8);
    
    var key = ds_map_find_first(message_params);
    var val = undefined;
    for (var i=0; i < ds_map_size(message_params); i++) {
        val = ds_map_find_value(message_params, key);

        ds_list_add(keyLengths, string_byte_length(key));
        ds_list_add(keyNames, key);
        
        if (is_string(val)) {
            ds_list_add(valueLengths, string_byte_length(val));
            ds_list_add(valueTypes, nm_param_string);
        } else if (is_int32(val)) {
            ds_list_add(valueLengths, 4);
            ds_list_add(valueTypes, nm_param_int32);
        } else if (is_real(val)) {
            ds_list_add(valueLengths, 4);
            ds_list_add(valueTypes, nm_param_float);
        }
        
        ds_list_add(values, val);       

        key = ds_map_find_next(message_params, key);
    }
    
    for (i=0; i < ds_list_size(keyLengths); i++) {
        size += 4;
        buffer_write(buffer, buffer_u32, keyLengths[| i]);
        buffer_write(buffer, buffer_u8, valueTypes[| i]);
    }
    
    for (i=0; i < ds_list_size(valueLengths); i++) {
        size += 4;
        buffer_write(buffer, buffer_u32, valueLengths[| i]);
    }
    
    for (i=0; i < ds_list_size(keyNames); i++) {
        size += string_byte_length(keyNames[| i]);
        buffer_write(buffer, buffer_text, keyNames[| i]);
    }
    
    for (i=0; i < ds_list_size(valueLengths); i++) {
        if (is_string(values[| i])) {
            size += string_byte_length(values[| i]);
            buffer_write(buffer, buffer_text, values[| i]);
        } else if (is_int32(values[| i])) {
            size += 4;
            buffer_write(buffer, buffer_s32, values[| i]);
        } else if (is_real(values[| i])) {
            size += 4;
            buffer_write(buffer, buffer_f32, values[| i]);
        }
    }
   
    network_send_packet(global.client, buffer, buffer_tell(buffer));
}
