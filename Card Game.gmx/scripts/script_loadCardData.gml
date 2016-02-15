file = file_text_open_read(working_directory + "\cards.json");
global.cards = json_decode(file);

var i, file;
file = file_text_open_read(working_directory + "\cards.json");

for (i = 0; i < 10; i += 1)
   {
   scr[i] = file_text_read_real(file);
   file_text_readln(file);
   scr_name[i] = file_text_read_string(file);
   file_text_readln(file);
   }
file_text_close(file);
