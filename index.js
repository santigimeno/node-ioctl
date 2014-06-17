var ioctl = require('bindings')('ioctl.node').ioctl;

module.exports = function(d, request, argp) {
    var ret = ioctl(d, request, argp);
    if (ret < 0) {
        var e = new Error('ioctl ' + ret);
        e.errno = e.code = ret;
        e.syscall = ioctl;
        throw e;
    }

    return ret;
};

