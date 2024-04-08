## Debug

### How to debug in NestJS
#### Snapshot in chrome
1. Add --inspect option to start NestJS app in package.json
```
"start:snapshot": "node --inspect --trace_gc -r tsconfig-paths/register -r ts-node/register src/main.ts"
```
Add --trace_gc option to log Garbage Collector

### Issues in grpc-js

1. In grpc-js, a "call" is represented by multiple objects that are responsible for different parts of making the request. The "Created child" logs are just each object creating the next object in the chain. The subchannel call is the lowest level object, interacting directly with HTTP/2 streams.

2. Practically speaking, I think the only real impact of this bug is a slightly confusing error description. The logs show that the client received a GOAWAY with code 2. When Node receives that, it also ends any open streams on that connection with code 2. gRPC translates the HTTP2 code 2 into the gRPC status code 13, which is what we are seeing here. The confusing part is that this should be reported as an internal server error, but the gRPC client is interpreting it as an internal client error.
[Issue](https://github.com/grpc/grpc-node/issues/2625)


3. memory leak in internal-channel.ts
Many ClientHttp2Sessions
[Issue]https://github.com/grpc/grpc-node/issues/2436

### Compression
Clients can now send compressed messages, and servers can now receive compressed messages.
Support for sending compressed messages from servers is still pending.
[Issue](https://github.com/grpc/grpc-node/issues/1823)

1. Set compression in client
```ts
providers: [
    {
      provide: 'SUBSCRIBER_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'subscribers',
            protoPath: join(process.cwd(), 'src/subscriber/subscribers.proto'),
            url: configService.get('GRPC_CONNECTION_URL'),
            loader: {
              arrays: true,
            },
            maxReceiveMessageLength: 2 * 1024 * 1024 * 1024,
            // maxSendMessageLength: 2 * 1024 * 1024 * 1024,
            channelOptions: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'grpc.default_compression_algorithm': 2,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
```
2. How does it work
- Client create a channel
![Create channe](image.png)
- Client compress mesage and send a request contains "grpc-encoding":["gzip"]

```ts
// compression-filter.js

class CompressionFilter extends filter_1.BaseFilter {
    constructor(channelOptions, sharedFilterConfig) {
        var _a;
        super();
        this.sharedFilterConfig = sharedFilterConfig;
        this.sendCompression = new IdentityHandler();
        this.receiveCompression = new IdentityHandler();
        this.currentCompressionAlgorithm = 'identity';
        const compressionAlgorithmKey = channelOptions['grpc.default_compression_algorithm'];
        if (compressionAlgorithmKey !== undefined) {
            if (isCompressionAlgorithmKey(compressionAlgorithmKey)) {
                const clientSelectedEncoding = compression_algorithms_1.CompressionAlgorithms[compressionAlgorithmKey];
                const serverSupportedEncodings = (_a = sharedFilterConfig.serverSupportedEncodingHeader) === null || _a === void 0 ? void 0 : _a.split(',');
                /**
                 * There are two possible situations here:
                 * 1) We don't have any info yet from the server about what compression it supports
                 *    In that case we should just use what the client tells us to use
                 * 2) We've previously received a response from the server including a grpc-accept-encoding header
                 *    In that case we only want to use the encoding chosen by the client if the server supports it
                 */
                if (!serverSupportedEncodings || serverSupportedEncodings.includes(clientSelectedEncoding)) {
                    this.currentCompressionAlgorithm = clientSelectedEncoding;
                    this.sendCompression = getCompressionHandler(this.currentCompressionAlgorithm);
                }
            }
            else {
                logging.log(constants_1.LogVerbosity.ERROR, `Invalid value provided for grpc.default_compression_algorithm option: ${compressionAlgorithmKey}`);
            }
        }
    }
```
![Alt text](image-1.png)
- Server will decompress received message.
```ts
// server.js
async function handleUnary(call, handler, metadata, encoding) {
    try {
        const request = await call.receiveUnaryMessage(encoding);
        if (request === undefined || call.cancelled) {
            return;
        }
        const emitter = new server_call_1.ServerUnaryCallImpl(call, metadata, request);
        handler.func(emitter, (err, value, trailer, flags) => {
            call.sendUnaryMessage(err, value, trailer, flags);
        });
    }
    catch (err) {
        call.sendError(err);
    }
}
```

3. Support for sending compressed messages from servers is still pending.
```ts
  serializeMessage(value) {
        const messageBuffer = this.handler.serialize(value);
        // TODO(cjihrig): Call compression aware serializeMessage().
        const byteLength = messageBuffer.byteLength;
        const output = Buffer.allocUnsafe(byteLength + 5);
        output.writeUInt8(0, 0);
        output.writeUInt32BE(byteLength, 1);
        messageBuffer.copy(output, 5);
        return output;
    }
```
=======
# nestjs-grpc-example

## Start subscription microservice
```bash
cd subscription-mmicroservice

npm run start:dev
```

## Start client
```bash
cd client

npm run start:dev
```

## Start user-microservice
```bash
cd user-microservice

npm run start:dev
```

## Curl
```bash
curl --location 'localhost:4001/subscriber'

curl --location 'localhost:4001/subscriber' \
--header 'Content-Type: application/json' \
--data-raw '{
    "user": {
        "name": "Name",
        "email": "email@dgmail.one"
    }
}'
```

## Run stress test
```bash
sh test.sh
```
