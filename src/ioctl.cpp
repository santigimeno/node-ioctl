#include <errno.h>
#include <sys/ioctl.h>
#include "nan.h"

using namespace v8;
using namespace node;

NAN_METHOD(Ioctl) {
    NanScope();
    Local<Object> buf;
    int length = args.Length();

    assert(length == 3);

    void* argp = NULL;

    if (!args[0]->IsInt32()) {
		NanThrowTypeError("Argument 0 Must be an Integer");
    }

    if (!args[1]->IsUint32()) {
		NanThrowTypeError("Argument 1 Must be an Integer");
    }

    if (!args[2]->IsUndefined()) {
        if (args[2]->IsInt32()) {
            argp = reinterpret_cast<void*>(args[2]->Int32Value());
        } else {
            buf = args[2]->ToObject();
            if (!Buffer::HasInstance(buf)) {
                NanThrowTypeError("Argument 2 Must be an Integer or a Buffer");
            }

            argp = Buffer::Data(buf);
        }
    }

    int fd = args[0]->Int32Value();
    unsigned long request = args[1]->IntegerValue();
    int res = ioctl(fd, request, argp);
    if (res == -1) {
        res = -errno;
    }

    NanReturnValue(NanNew(res));
}

void InitAll(Handle<Object> exports) {
    exports->Set(NanNew("ioctl"),
                 NanNew<FunctionTemplate>(Ioctl)->GetFunction());
}

NODE_MODULE(ioctl, InitAll)

