var Message = require ('../net/Message.js');
var fs = require('fs');
var Router = module.parent.exports.Router;
var db =     module.parent.exports.db;
var NM_FILE = 4;

Router.on(NM_FILE, function(sock, msg) {
    console.log("File REQUEST: ");
    console.dir(msg);
    if (msg.params.fileName) {
        db.collection('files').findOne({id: msg.params.fileName}, function(err, doc) {
            if (!err && doc && doc['path']) {
                var fileData = fs.readFileSync(doc['path']);
                console.log("file is type: " + typeof fileData + " and buffer: " + (fileData instanceof Buffer) + "[" + fileData.length + "]");
                sock.write(Message.write(4, {success: true, fileID: doc['id'], filePath: doc['path'], fileData: fileData}));
            } else {
                console.log("doc not found: " + msg.params.fileName + " err: " + err);
                console.dir(doc);
                sock.write(Message.write(4, {success: false}));
            }
        });
    } else {
        console.log("Bad sprite request: no filename");
        sock.write(Message.write(4, {success: false}));
    }
});
