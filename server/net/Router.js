var Message = require('./Message.js');

//MESSAGE TYPES
NM_CONNECT      = 1;
NM_LOGIN        = 2;
NM_PLAY         = 3;
NM_FILE         = 4;

var Router = function(authModule, fileModule) {
    this.auth = authModule;
    this.file = fileModule;
};

var allSocks = [];

Router.prototype.process = function(sock, msg) {
    var type = msg["type"];
    switch (type) {
        case NM_CONNECT:
            sock.write(Message.write(1, {}));
            allSocks.push(sock);
            break;
        case NM_LOGIN:
            this.auth.onLogin(sock, msg);
            break;
        case NM_PLAY:
            break;
        case NM_FILE:
            this.file.onRequest(sock, msg);
        case 300:
            var r = parseInt(Math.random() * 100);
            allSocks.forEach(function(sock) {
                sock.write(Message.write(300, {randomNumber: r}));
            });
    };
};

module.exports = function(authModule, fileModule) {
    return new Router(authModule, fileModule);
};
