var Message = require ('../net/Message.js');
var Router = module.parent.exports.Router;
var db =     module.parent.exports.db;
var NM_DATA       = 5;

Router.on(NM_DATA, function(sock, msg) {
    if (msg.params.collection) {
        var filter = {};
        if (msg.params.filter) {
            filter = JSON.parse(msg.params.filter);
        }

    console.log("Data request: " + msg.params.collection + ' filter: ' + typeof filter);
    console.log(filter);
        db.collection(msg.params.collection).find(filter).toArray(function(err, doc) {
            if (!err && doc) {
                console.log(JSON.stringify(doc));
                sock.write(Message.write(NM_DATA, {success: true, data: JSON.stringify(doc)}));
            } else {
                console.log("ERROR: ");
                console.dir(err);
                sock.write(Message.write(NM_DATA, {success: false}));
            }
        });
    } else {
        sock.write(Message.write(2, {success: false}));
    }
});
