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

    if (!info[0]->IsUint32()) {
        Nan::ThrowTypeError("Argument 0 Must be an Integer");
    }

    if (!info[1]->IsUint32()) {
        Nan::ThrowTypeError("Argument 1 Must be an Integer");
    }

    if ((length == 3) && !info[2]->IsUndefined()) {
        if (info[2]->IsInt32()) {
            argp = reinterpret_cast<void*>(Nan::To<int32_t>(info[2]).ToChecked());
        } else if (info[2]->IsObject()) {
            buf = Nan::To<Object>(info[2]).ToLocalChecked();
            if (!Buffer::HasInstance(buf)) {
                Nan::ThrowTypeError("Argument 2 Must be an Integer or a Buffer");
            }

            argp = Buffer::Data(buf);
        }
    }

    int fd = Nan::To<int32_t>(info[0]).ToChecked();
    unsigned long request = Nan::To<uint32_t>(info[1]).ToChecked();

    int res = ioctl(fd, request, argp);
    if (res < 0) {
        return Nan::ThrowError(Nan::ErrnoException(errno, "ioctl", nullptr, nullptr));
    }

    info.GetReturnValue().Set(res);
}

void InitAll(Local<Object> exports) {
    Nan::Set(exports,
             Nan::New("ioctl").ToLocalChecked(),
             Nan::GetFunction(Nan::New<FunctionTemplate>(Ioctl)).ToLocalChecked());
}

NODE_MODULE(ioctl, InitAll)

