var fs = require('fs');
var ioctl = require('../');
var ref = require('ref');
var ArrayType = require('ref-array');
var StructType = require('ref-struct');

var SND_HW = '/dev/snd/hwC0D0';
var HDA_IOCTL_PVERSION = 0x80dc4801;

// struct snd_hwdep_info {
//     unsigned int device;        /* WR: device number */
//     int card;           /* R: card number */
//     unsigned char id[64];       /* ID (user selectable) */
//     unsigned char name[80];     /* hwdep name */
//     int iface;          /* hwdep interface */
//     unsigned char reserved[64]; /* reserved for future */
// };

// define the "snd_hwdep_info" struct type
var snd_hwdep_info = StructType({
    device : ref.types.uint32,
    card : ref.types.int32,
    id : ArrayType(ref.types.uchar, 64),
    name : ArrayType(ref.types.uchar, 80),
    iface : ref.types.int32,
    reserved : ArrayType(ref.types.uchar, 64)
});

var info = new snd_hwdep_info();

fs.open(SND_HW, 'r', function(err, fd) {
    if (err) {
        throw err;
    }

    var ret = ioctl(fd, HDA_IOCTL_PVERSION, info.ref());
    console.log('device: ' + info.device);
    console.log('card: ' + info.card);
    console.log('id: ' + info.id.buffer.toString());
    console.log('name: ' + info.name.buffer.toString());
    console.log('iface: ' + info.iface);
    console.log('reserved: ' + info.reserved.buffer.toString());
    fs.close(fd);
});
