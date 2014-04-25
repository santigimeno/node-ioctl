#include <sys/ioctl.h>
#include <v8.h>
#include <node.h>
#include "nan.h"

using namespace v8;
using namespace node;

NAN_METHOD(Ioctl) {
    NanScope();

    int length = args.Length();

    assert((length == 2) || (length == 3));

    void* argp = NULL;

    if (!args[0]->IsInt32()) {
        return ThrowException(Exception::TypeError(String::New("Argument 0 Must be an Integer")));
    }

    if (!args[1]->IsUint32()) {
        return ThrowException(Exception::TypeError(String::New("Argument 1 Must be an Integer")));
    }

    if (length == 3) {
        if (!Buffer::HasInstance(args[2])) {
            return ThrowException(Exception::TypeError(String::New("Argument 2 Must be a Buffer")));
        }

        argp = Buffer::Data(args[2]);
    }

    int fd = args[0]->Int32Value();
    int request = args[1]->Uint32Value();
    int res = ioctl(fd, request, argp);

    NanReturnValue(Number::New(res));
}

void InitAll(Handle<Object> exports) {
  exports->Set(NanSymbol("ioctl"), FunctionTemplate::New(Ioctl)->GetFunction());
}

NODE_MODULE(ioctl, InitAll)
