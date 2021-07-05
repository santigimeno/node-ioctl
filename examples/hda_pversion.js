'use strict';

const fs = require('fs');
const ioctl = require('../');
const sharedStructs = require('shared-structs');

const SND_HW = '/dev/snd/hwC0D0';
const HDA_IOCTL_PVERSION = 0x80dc4801;

const structs = sharedStructs(`
  struct snd_hwdep_info {
    uint32_t device;        /* WR: device number */
    int card;           /* R: card number */
    char id[64];       /* ID (user selectable) */
    char name[80];     /* hwdep name */
    int iface;          /* hwdep interface */
    char reserved[64]; /* reserved for future */
  };
`);

const info = structs.snd_hwdep_info();

fs.open(SND_HW, 'r', function(err, fd) {
    if (err) {
        throw err;
    }

    const ret = ioctl(fd, HDA_IOCTL_PVERSION, info.rawBuffer);
    console.log('device: ' + info.device);
    console.log('card: ' + info.card);
    console.log('id: ' + info.id.toString());
    console.log('name: ' + info.name.toString());
    console.log('iface: ' + info.iface);
    console.log('reserved: ' + info.reserved.toString());
    fs.close(fd);
});
