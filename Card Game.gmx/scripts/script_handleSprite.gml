var args = argument[0];
var data = args[0];

var success = data[? "success"];
var spriteFile = data[? "filePath"];
var spriteData = data[? "fileData"];

if (success) {
    var sp_file = string_replace_all(spriteFile, '/', '\');
    buffer_save(spriteData, sp_file);
}

global.waitingSpriteData = false;



