eventName = argument0;
scriptName = argument1;

if (!ds_map_exists(global.events, eventName)) {
    newList = ds_map_create();
    ds_map_add(newList, id, scriptName);
    ds_map_add(global.events, eventName, newList);
} else {
    list = ds_map_find_value(global.events, eventName);
    ds_map_add(list, id, scriptName);
}
