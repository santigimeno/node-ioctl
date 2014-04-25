var dgram = require('dgram');
var ioctl = require('../');

var FIONREAD = 0x541B;

var s = dgram.createSocket('udp4');
s.bind(1234, function(err) {
    if (err) {
        throw err;
    }

    var s1 = dgram.createSocket('udp4');
    var message = new Buffer("Some bytes");
    s1.send(message, 0, message.length, 1234, "localhost", function(err, bytes) {
        var length = new Buffer(4);
        var ret = ioctl(s._handle.fd, FIONREAD, length);
        console.log('Pending bytes: ' + length.readInt32LE(0));
        s1.close();
        s.close();
    });
});
