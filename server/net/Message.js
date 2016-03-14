var binary = require('binary');

NM_PARAM_STRING = 1;
NM_PARAM_INT32  = 2;
NM_PARAM_FLOAT  = 3;

var Message = function() {};
Message.prototype.write = function(type, msg) {
    var keys = Object.getOwnPropertyNames(msg);
    var paramCount = keys.length, ws, buffer = new Buffer(8 + (paramCount * 9));
    var valueLengths = [];
    var values = [];
    var offset = 0;
    
    buffer.writeUInt32LE(type, 0);
    buffer.writeUInt32LE(paramCount, 4);
    offset += 8;
    
    i = 0;
    keys.forEach(function(k) {
        buffer.writeUInt32LE(k.length, offset);
        offset += 4;

        if (typeof msg[k] == "boolean") {
            msg[k] = msg[k] ? 1 : 0;
        }
        if (typeof msg[k] == "string") {
            valueLengths.push(msg[k].length);
            buffer.writeUInt8(NM_PARAM_STRING, offset);
            offset += 1;
        } else {
            valueLengths.push(4);
            buffer.writeUInt8(NM_PARAM_FLOAT, offset);
            offset += 1;
        }
        values.push(msg[k]);
        i++;
    });

    valueLengths.forEach(function(vl) {
        buffer.writeUInt32LE(vl, offset);
        offset+=4;
    }); 

    var knBuffer;
    keys.forEach(function(k) {
        kBuffer = new Buffer(k);
        buffer = Buffer.concat([buffer, kBuffer], buffer.length + kBuffer.length);
    });

    var vBuffer;
    values.forEach(function(v) {
        if (typeof v == "string") {
            vBuffer = new Buffer(v);
            buffer = Buffer.concat([buffer, vBuffer], buffer.length + vBuffer.length);
        } else {
            vBuffer = new Buffer(4);
            vBuffer.writeFloatLE(parseFloat(v), 0);
            buffer = Buffer.concat([buffer, vBuffer], buffer.length + vBuffer.length);
        }
    });

    return buffer;
};

Message.prototype.read = function(data) {
    var vars, i=0;

    vars = binary.parse(data)
    .word32lu('messageId')
    .word32lu('paramCount')
    .loop(function(end, v) {
        if (this.eof()) { end(); }
        if (++i <= v['paramCount']) {
            v['keyLengths'] = v['keyLengths'] || [];
            v['keyLengths'].push(this.word32lu('keyLen').vars['keyLen']);

            v['valTypes'] = v['valTypes'] || [];
            v['valTypes'].push(this.word8lu('vtype').vars['vtype']);
        } else {
            i = 0;
            end();
        }
    })
    .loop(function(end, v) {
        if (this.eof()) { end(); }
        if (++i <= v['paramCount']) {
            v['valLengths'] = v['valLengths'] || [];
            v['valLengths'].push(this.word32lu('valLen').vars['valLen']);
        } else {
            i = 0;
            end();
        }
    })
    .loop(function(end, v) {
        if (this.eof()) { end(); }
        if (++i <= v['paramCount']) {
            v['keys'] = v['keys'] || [];
            v['keys'].push(this.buffer('key', v['keyLengths'][i-1]).vars['key'].toString());
        } else {
            i = 0;
            end();
        }
    })
    .loop(function(end, v) {
        if (this.eof()) { end(); }
        if (++i <= v['paramCount']) {
            v['values'] = v['values'] || [];
            if (v['valTypes'][i-1] == NM_PARAM_STRING) {
                v['values'].push(this.buffer('val', v['valLengths'][i-1]).vars['val'].toString());
            } else if (v['valTypes'][i-1] == NM_PARAM_INT32) {
                v['values'].push(this.word32ls('val').vars['val']);
            } else if (v['valTypes'][i-1] == NM_PARAM_FLOAT) {
                v['values'].push(this.buffer('val', v['valLengths'][i-1]).vars['val'].readFloatLE(0));
            }
        } else {
            i = 0;
            end();
        }
    })
    .vars;

    var msg = {
        type: vars['messageId'],
        params: {
        }
    };

    for (i=0; i < vars['paramCount']; i++) {
        msg.params[vars['keys'][i]] = vars['values'][i];
    }
    
    return msg;
};

module.exports = new Message();
