eventName = argument0;

if (!ds_map_exists(global.events, eventName)) {
    newList = ds_list_create();
    ds_list_add(newList, id);
    ds_map_add(global.events, eventName, newList);
} else {
    list = ds_map_find_value(global.events, eventName);
    ds_list_add(list, id);
}
