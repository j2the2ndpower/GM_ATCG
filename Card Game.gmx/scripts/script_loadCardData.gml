var i, file, json = "";
file = file_text_open_read(working_directory + "\cards.json");

while(!file_text_eof(file)) {
   json = json + file_text_readln(file);
}
file_text_close(file);

var cardMap = json_decode(json);
global.cards = cardMap[? "cards"];
