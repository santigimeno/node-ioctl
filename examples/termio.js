'use strict';

const fs = require('fs');
const ioctl = require('../');
const sharedStructs = require('shared-structs');

const TTY = '/dev/tty1';
const TCGETA = 0x5405;
const TIOCEXCL = 0x540C;

const structs = sharedStructs(`
  struct termio {
    uint16_t c_iflag;     /* input mode flags */
    uint16_t c_oflag;     /* output mode flags */
    uint16_t c_cflag;     /* control mode flags */
    uint16_t c_lflag;     /* local mode flags */
    uint8_t c_line;       /* line discipline */
    uint8_t c_cc[8];    /* control characters */
  };
`);

fs.open(TTY, 'r+', function(err, fd) {
    if (err) {
        throw err;
    }

    var info = structs.termio();
    var ret = ioctl(fd, TCGETA, info.rawBuffer);
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
