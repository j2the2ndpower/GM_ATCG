var Message = require ('../net/Message.js');

var Auth = function() {};
Auth.prototype.onLogin = function(sock, msg) {
    //Validate here
    if (msg["username"]) {
        sock.write(Message.write(2, {success: true}));
    } else {
        sock.write(Message.write(2, {success: false}));
    }
};

module.exports = new Auth();
