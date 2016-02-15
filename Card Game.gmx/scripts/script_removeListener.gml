eventName = argument0;

if (ds_map_exists(global.events, eventName)) {
    list = ds_map_find_value(global.events, eventName);
    if (ds_map_exists(list, id)) {
        ds_map_delete(list, id);
    }
}
