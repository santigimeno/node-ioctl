node-ioctl
==========

node ioctl wrapper

Installation
------------

Install with `npm`:

``` bash
$ npm install ioctl
```

API
--------

### ioctl(fileDescriptor, request, data)
**Parameters**
- **fileDescriptor**: `Integer` Target file descriptor, must be open.
- **request**: `Integer` Device specific request code.
- **data**: `Integer|Buffer` Request data.

**Returns**: `Integer` Usually zero is returned, some calls use the return value as a output parameter
and may return a positive integer.

**Throws**: Throws on failed `ioctl` call.

Examples
--------

Read bytes of the next pending datagram using FIONREAD.
As it takes a pointer as a parameter, it's straightforward using a Buffer as a parameter.

```
var dgram = require('dgram');
var ioctl = require('ioctl');

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
```

For other cases, involving complex structs, we can use the `ref`, `ref-array` and `ref-struct` modules.

```
var fs = require('fs');
var ioctl = require('ioctl');
var ref = require('ref');
var ArrayType = require('ref-array');
var StructType = require('ref-struct');

var TTY = '/dev/tty1';
var TCGETA = 0x5405;
var TIOCEXCL = 0x540C;

// #define NCC 8
// struct termio {
// unsigned short c_iflag; /* input mode flags */
// unsigned short c_oflag; /* output mode flags */
// unsigned short c_cflag; /* control mode flags */
// unsigned short c_lflag; /* local mode flags */
// unsigned char c_line; /* line discipline */
// unsigned char c_cc[NCC]; /* control characters */
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
```
