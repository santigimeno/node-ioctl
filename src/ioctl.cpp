#include <errno.h>
#include <sys/ioctl.h>
#include "nan.h"

using namespace v8;
using namespace node;

NAN_METHOD(Ioctl) {
    Nan::HandleScope scope;

    Local<Object> buf;
    int length = info.Length();

    assert((length == 2) || (length == 3));

    void* argp = NULL;

    if (!info[0]->IsInt32()) {
        Nan::ThrowTypeError("Argument 0 Must be an Integer");
    }

    if (!info[1]->IsUint32()) {
        Nan::ThrowTypeError("Argument 1 Must be an Integer");
    }

    if ((length == 3) && !info[2]->IsUndefined()) {
        if (info[2]->IsInt32()) {
            argp = reinterpret_cast<void*>(info[2]->Int32Value());
        } else {
            buf = info[2]->ToObject();
            if (!Buffer::HasInstance(buf)) {
                Nan::ThrowTypeError("Argument 2 Must be an Integer or a Buffer");
            }

            argp = Buffer::Data(buf);
        }
    }

    int fd = info[0]->Int32Value();
    unsigned long request = info[1]->IntegerValue();

    int res = ioctl(fd, request, argp);
    if (res < 0) {
        return Nan::ThrowError(Nan::ErrnoException(errno, "ioctl", nullptr, nullptr));
    }

    info.GetReturnValue().Set(res);
}

void InitAll(Local<Object> exports) {
    exports->Set(Nan::New("ioctl").ToLocalChecked(),
                 Nan::New<FunctionTemplate>(Ioctl)->GetFunction());
}

NODE_MODULE(ioctl, InitAll)

