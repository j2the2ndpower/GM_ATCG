var eventName = argument[0], arg, i;

for (i = 1; i < argument_count; i++) {
    arg[i-1] = argument[i];
}

if (ds_map_exists(global.events, eventName)) {
    var script, list = ds_map_find_value(global.events, eventName), instance = ds_map_find_first(list);
    
    for (i = 0; i < ds_map_size(list); i++) {
        script = ds_map_find_value(list, instance);
        if (instance_exists(instance) && script_exists(script)) {
            with(instance) {
                script_execute(script, arg);
            }
        }
        instance = ds_map_find_next(list, instance);
    }
}
