var Message = require ('../net/Message.js');
var Router = module.parent.exports.Router;
var db =     module.parent.exports.db;
var ObjectID = require('mongodb').ObjectID;
var NM_LOGIN       = 2;

Router.on(NM_LOGIN, function(sock, msg) {
    if (msg.params.username) {
        db.collection('users').findOne({username: msg.params.username, password: msg.params.password}, function(err, doc) {
            if (!err && doc && doc['username']) {
                sock.write(Message.write(NM_LOGIN, {success: true, username: doc['username'], avatar: doc['avatar'], avatarID: doc['avatarID']}));
                sock.userID = doc['_id'];
            } else {
                console.log("ERROR: ");
                console.dir(err);
                sock.write(Message.write(2, {success: false}));
            }
        });
    } else {
        sock.write(Message.write(2, {success: false}));
    }
});
