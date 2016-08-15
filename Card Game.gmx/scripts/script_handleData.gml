var args = argument0;
var data = args[0];
var i, sx = x + 40, sy = y + 120, row = 0, col = 0;

if (ds_exists(data, ds_type_map)) {
    var s = data[? "success"];
    var r;
    if (data[? "success"] == true) {
        var records = ds_map_find_value(json_decode(data[? "data"]), "default");
        avatarData = records;
        for (r = 0; r < ds_list_size(records); r++) {
            if (col = 4) {
                row++;
                col = 0;
            }
            
            var record = records[| r];
            var spriteName = record[? "id"];
            var spriteFile = record[? "path"];
            var sprite = script_getSprite(spriteName, spriteFile);
            ds_list_add(avatarOptions, sprite);
            var icon = instance_create(sx + (col*70), sy + (row*70), avatarIcon);
            icon.uiSprite = sprite;
            icon.avatarData = record;
            icon.uiSpriteScale = 1;
            icon.uiAnchor = oAvatarWindow;
            col++
        }
    }
}
