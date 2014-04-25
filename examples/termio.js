var fs = require('fs');
var ioctl = require('../');
var ref = require('ref');
var ArrayType = require('ref-array');
var StructType = require('ref-struct');

var TTY = '/dev/tty1';
var TCGETA = 0x5405;
var TIOCEXCL = 0x540C;

// #define NCC 8
// struct termio {
//     unsigned short c_iflag;     /* input mode flags */
//     unsigned short c_oflag;     /* output mode flags */
//     unsigned short c_cflag;     /* control mode flags */
//     unsigned short c_lflag;     /* local mode flags */
//     unsigned char c_line;       /* line discipline */
//     unsigned char c_cc[NCC];    /* control characters */
// };

// define the "snd_hwdep_info" struct type
var termio = StructType({
    c_iflag : ref.types.ushort,
    c_oflag : ref.types.ushort,
    c_cflag : ref.types.ushort,
    c_lflag : ref.types.ushort,
    c_line : ref.types.uchar,
    c_cc : ArrayType(ref.types.uchar, 8)
});

fs.open(TTY, 'r+', function(err, fd) {
    if (err) {
        throw err;
    }

    var info = new termio();
    var ret = ioctl(fd, TCGETA, info.ref());
    console.log('TCGETA ret: ' + ret);
    console.log('c_iflag: ' + info.c_iflag);
    console.log('c_oflag: ' + info.c_oflag);
    console.log('c_cflag: ' + info.c_cflag);
    console.log('c_lflag: ' + info.c_lflag);
    console.log('c_line: ' + info.c_line);
    console.log('c_cc: ' + info.c_cc.buffer.toString());
    ret = ioctl(fd, TIOCEXCL);
    console.log('TIOCEXCL ret: ' + ret);
    fs.close(fd);
});
