var args = argument0;
var data = args[0];

if (ds_exists(data, ds_type_map)) {
    var s = data[? "success"];
    if (data[? "success"] == true) {
        instance_destroy();
        (instance_find(objMenuPlay, 0)).visible = true;
        (instance_find(objMenuCollection, 0)).visible = true;
        (instance_find(objMenuShop, 0)).visible = true;
        (instance_find(objMenuOptions, 0)).visible = true;
        (instance_find(objMenuExit, 0)).visible = true;
    } else {
        show_message("Invalid login");
    }
}
