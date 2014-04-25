var fs = require('fs');
var ioctl = require('../');
var ref = require('ref');
var ArrayType = require('ref-array');
var StructType = require('ref-struct');

var WATCHDOG_DEVICE = '/dev/watchdog';
var WDIOC_GETSUPPORT = 2150127360;

// struct watchdog_info {
//     __u32 options;      /* Options the card/driver supports */
//     __u32 firmware_version; /* Firmware version of the card */
//     __u8  identity[32]; /* Identity of the board */
// };

// define the "snd_hwdep_info" struct type
var watchdog_info = StructType({
    options : ref.types.uint32,
    firmware_version : ref.types.uint32,
    identity : ArrayType(ref.types.uchar, 32)
});

var info = new watchdog_info();

fs.open(WATCHDOG_DEVICE, 'r', function(err, fd) {
    if (err) {
        throw err;
    }

    var ret = ioctl(fd, WDIOC_GETSUPPORT, info.ref());
    console.log('options: ' + info.options);
    console.log('firmware_version: ' + info.firmware_version);
    console.log('identity: ' + info.identity.buffer.toString());
    fs.close(fd);
});
