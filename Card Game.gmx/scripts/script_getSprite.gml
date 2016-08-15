var spriteName = argument[0];
var spriteFile = argument[1];
var sprite = undefined;

if (string(spriteName) == "undefined" || string(spriteFile) == "undefined") {
    return false;
}

if (global.dSprites[? spriteName]) {
    sprite = global.dSprites[? spriteName];
} else {
    //load this sprite
    if (file_exists(spriteFile)) {
        sprite = sprite_add(spriteFile, 0, false, false, 0, 0);
        ds_map_add(global.dSprites, spriteName, sprite);
    } else if (!global.waitingSpriteData) {
        global.waitingSpriteData = true;
        var data = ds_map_create();
        ds_map_add(data, "fileName", spriteName);
        script_sendMsg(nm_sprite, data);
    }
}

return sprite;
