var Message = require('./Message.js');

//MESSAGE TYPES
NM_CONNECT      = 1;
NM_LOGIN        = 2;
NM_PLAY         = 3;

var Router = function(authModule) {
    this.auth = authModule;
};

Router.prototype.process = function(sock, msg) {
    var type = msg["type"];
    switch (type) {
        case NM_CONNECT:
            sock.write(Message.write(1, {}));
            break;
        case NM_LOGIN:
            this.auth.onLogin(sock, msg);
            break;
        case NM_PLAY:
            break;
    };
};

module.exports = function(authModule) {
    return new Router(authModule);
};
