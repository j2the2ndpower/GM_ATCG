var Message = require ('../net/Message.js');

var Auth = function(db) {
    this.db = db;
};

Auth.prototype.onLogin = function(sock, msg) {
    if (msg.params.username) {
        this.db.collection('users').findOne({username: msg.params.username, password: msg.params.password}, function(err, doc) {
            if (!err && doc && doc['username']) {
                sock.write(Message.write(2, {success: true}));
            } else {
                console.log("ERROR: ");
                console.dir(err);
                sock.write(Message.write(2, {success: false}));
            }
        });
    } else {
        sock.write(Message.write(2, {success: false}));
    }
};

module.exports = function(db) {
    return new Auth(db);
}
