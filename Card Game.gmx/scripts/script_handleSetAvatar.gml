var args = argument0;
var data = args[0];

if (ds_exists(data, ds_type_map)) {
    var s = data[? "success"];
    var r;
    if (data[? "success"] == true) {
        global.player[? "avatar"] = data[? "avatar"];
        global.player[? "avatarID"] = data[? "avatarID"];
    }
}
