var Message = require ('../net/Message.js');
var Router = module.parent.exports.Router;
var db =     module.parent.exports.db;
var NM_SETAVATAR       = 6;

Router.on(NM_SETAVATAR, function(sock, msg) {
    if (sock.userID && msg.params.avatarID && msg.params.avatar) {
        db.collection('users').update({_id: sock.userID}, {$set: {avatarID: msg.params.avatarID, avatar: msg.params.avatar}}, function(err, numUpdated) {
            if (!err) {
                db.collection('users').findOne({_id: sock.userID}, function(err, doc) {
                    if (!err && doc) {
                        sock.write(Message.write(NM_SETAVATAR, {success: true, username: doc['username'], avatar: doc['avatar'], avatarID: doc['avatarID']}));
                    } else {
                        console.log("update user avatar failed.");
                        console.dir(err);
                    }
                });
            }
        });
    } else {
        console.log("can't update avatar for user: " + sock.userID);
        console.dir(msg.params);
    }
});
