'use strict';

const fs = require('fs');
const ioctl = require('../');
const sharedStructs = require('shared-structs');

const WATCHDOG_DEVICE = '/dev/watchdog';
const WDIOC_GETSUPPORT = 2150127360;

const structs = sharedStructs(`
  struct watchdog_info {
    uint32_t options;      /* Options the card/driver supports */
    uint32_t firmware_version; /* Firmware version of the card */
    uint8_t  identity[32]; /* Identity of the board */
  };
`);

const info = structs.watchdog_info();

fs.open(WATCHDOG_DEVICE, 'r', function(err, fd) {
    if (err) {
        throw err;
    }

    const ret = ioctl(fd, WDIOC_GETSUPPORT, info.rawBuffer);
    console.log('options: ' + info.options);
    console.log('firmware_version: ' + info.firmware_version);
    console.log('identity: ' + info.identity.toString());
    fs.close(fd);
});
