'use struct';

const dgram = require('dgram');
const ioctl = require('../');

const FIONREAD = 0x541B;

const s = dgram.createSocket('udp4');
s.bind(1234, function(err) {
    if (err) {
        throw err;
    }

    const s1 = dgram.createSocket('udp4');
    const message = Buffer.from("Some bytes")
    s1.send(message, 0, message.length, 1234, "localhost", function(err, bytes) {
        const length = Buffer.alloc(4)
        const ret = ioctl(s._handle.fd, FIONREAD, length);
        console.log('Pending bytes: ' + length.readInt32LE(0));
        s1.close();
        s.close();
    });
});
