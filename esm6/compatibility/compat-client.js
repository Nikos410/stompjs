var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Client } from "../client";
/**
 * Available for backward compatibility, please shift to using {@link Client}.
 *
 * **Deprecated**
 */
var CompatClient = /** @class */ (function (_super) {
    __extends(CompatClient, _super);
    /**
     * Available for backward compatibility, please shift to using {@link Client}
     * and [Client#webSocketFactory]{@link Client#webSocketFactory}.
     *
     * **Deprecated**
     */
    function CompatClient(webSocketFactory) {
        var _this = _super.call(this) || this;
        _this._heartbeatInfo = new HeartbeatInfo(_this);
        _this.reconnect_delay = 0;
        _this.webSocketFactory = webSocketFactory;
        // Default from previous version
        _this.debug = function () {
            var message = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                message[_i] = arguments[_i];
            }
            console.log.apply(console, message);
        };
        return _this;
    }
    CompatClient.prototype._parseConnect = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var closeEventCallback, connectCallback, errorCallback;
        var headers = {};
        if (args.length < 2) {
            throw ("Connect requires at least 2 arguments");
        }
        if (typeof (args[1]) === 'function') {
            headers = args[0], connectCallback = args[1], errorCallback = args[2], closeEventCallback = args[3];
        }
        else {
            switch (args.length) {
                case 6:
                    headers['login'] = args[0], headers['passcode'] = args[1], connectCallback = args[2], errorCallback = args[3], closeEventCallback = args[4], headers['host'] = args[5];
                    break;
                default:
                    headers['login'] = args[0], headers['passcode'] = args[1], connectCallback = args[2], errorCallback = args[3], closeEventCallback = args[4];
            }
        }
        return [headers, connectCallback, errorCallback, closeEventCallback];
    };
    /**
     * Available for backward compatibility, please shift to using [Client#activate]{@link Client#activate}.
     *
     * **Deprecated**
     *
     * The `connect` method accepts different number of arguments and types. See the Overloads list. Use the
     * version with headers to pass your broker specific options.
     *
     * overloads:
     * - connect(headers, connectCallback)
     * - connect(headers, connectCallback, errorCallback)
     * - connect(login, passcode, connectCallback)
     * - connect(login, passcode, connectCallback, errorCallback)
     * - connect(login, passcode, connectCallback, errorCallback, closeEventCallback)
     * - connect(login, passcode, connectCallback, errorCallback, closeEventCallback, host)
     *
     * params:
     * - headers, see [Client#connectHeaders]{@link Client#connectHeaders}
     * - connectCallback, see [Client#onConnect]{@link Client#onConnect}
     * - errorCallback, see [Client#onStompError]{@link Client#onStompError}
     * - closeEventCallback, see [Client#onWebSocketClose]{@link Client#onWebSocketClose}
     * - login [String]
     * - passcode [String]
     * - host [String] Optional, virtual host to connect to. STOMP 1.2 makes it mandatory,
     *                 however the broker may not mandate it
     *
     * ```javascript
     *        client.connect('guest, 'guest', function(frame) {
     *          client.debug("connected to Stomp");
     *          client.subscribe(destination, function(message) {
     *            $("#messages").append("<p>" + message.body + "</p>\n");
     *          });
     *        });
     * ```
     *
     * Note: When auto reconnect is active, `connectCallback` and `errorCallback` will be called on each connect or error
     *
     * See also: [CONNECT Frame]{@link http://stomp.github.com/stomp-specification-1.2.html#CONNECT_or_STOMP_Frame}
     */
    CompatClient.prototype.connect = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var out = this._parseConnect.apply(this, args);
        if (out[0]) {
            this.connectHeaders = out[0];
        }
        if (out[1]) {
            this.onConnect = out[1];
        }
        if (out[2]) {
            this.onStompError = out[2];
        }
        if (out[3]) {
            this.onWebSocketClose = out[3];
        }
        _super.prototype.activate.call(this);
    };
    /**
     * Available for backward compatibility, please shift to using [Client#activate]{@link Client#activate}.
     *
     * **Deprecated**
     *
     * See:
     * [Client#onDisconnect]{@link Client#onDisconnect}, and
     * [Client#disconnectHeaders]{@link Client#disconnectHeaders}
     */
    CompatClient.prototype.disconnect = function (disconnectCallback, headers) {
        if (headers === void 0) { headers = {}; }
        if (disconnectCallback) {
            this.onDisconnect = disconnectCallback;
        }
        this.disconnectHeaders = headers;
        _super.prototype.deactivate.call(this);
    };
    /**
     * Available for backward compatibility, use [Client#publish]{@link Client#publish}.
     *
     * Send a message to a named destination. Refer to your STOMP broker documentation for types
     * and naming of destinations. The headers will, typically, be available to the subscriber.
     * However, there may be special purpose headers corresponding to your STOMP broker.
     *
     *  **Deprecated**, use [Client#publish]{@link Client#publish}
     *
     * Note: Body must be String. You will need to covert the payload to string in case it is not string (e.g. JSON)
     *
     * ```javascript
     *        client.send("/queue/test", {priority: 9}, "Hello, STOMP");
     *
     *        // If you want to send a message with a body, you must also pass the headers argument.
     *        client.send("/queue/test", {}, "Hello, STOMP");
     * ```
     *
     * See: http://stomp.github.com/stomp-specification-1.2.html#SEND SEND Frame
     */
    CompatClient.prototype.send = function (destination, headers, body) {
        if (headers === void 0) { headers = {}; }
        if (body === void 0) { body = ''; }
        var skipContentLengthHeader = (headers['content-length'] === false);
        if (skipContentLengthHeader) {
            delete headers['content-length'];
        }
        this.publish({
            destination: destination,
            headers: headers,
            body: body,
            skipContentLengthHeader: skipContentLengthHeader
        });
    };
    Object.defineProperty(CompatClient.prototype, "reconnect_delay", {
        /**
         * Available for backward compatibility, renamed to [Client#reconnectDelay]{@link Client#reconnectDelay}.
         *
         * **Deprecated**
         */
        set: function (value) {
            this.reconnectDelay = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompatClient.prototype, "ws", {
        /**
         * Available for backward compatibility, renamed to [Client#webSocket]{@link Client#webSocket}.
         *
         * **Deprecated**
         */
        get: function () {
            return this._webSocket;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompatClient.prototype, "onreceive", {
        /**
         * Available for backward compatibility, renamed to [Client#onUnhandledMessage]{@link Client#onUnhandledMessage}.
         *
         * **Deprecated**
         */
        get: function () {
            return this.onUnhandledMessage;
        },
        /**
         * Available for backward compatibility, renamed to [Client#onUnhandledMessage]{@link Client#onUnhandledMessage}.
         *
         * **Deprecated**
         */
        set: function (value) {
            this.onUnhandledMessage = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompatClient.prototype, "onreceipt", {
        /**
         * Available for backward compatibility, renamed to [Client#onUnhandledReceipt]{@link Client#onUnhandledReceipt}.
         * Prefer using [Client#watchForReceipt]{@link Client#watchForReceipt}.
         *
         * **Deprecated**
         */
        get: function () {
            return this.onUnhandledReceipt;
        },
        /**
         * Available for backward compatibility, renamed to [Client#onUnhandledReceipt]{@link Client#onUnhandledReceipt}.
         *
         * **Deprecated**
         */
        set: function (value) {
            this.onUnhandledReceipt = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompatClient.prototype, "heartbeat", {
        /**
         * Available for backward compatibility, renamed to [Client#heartbeatIncoming]{@link Client#heartbeatIncoming}
         * [Client#heartbeatOutgoing]{@link Client#heartbeatOutgoing}.
         *
         * **Deprecated**
         */
        get: function () {
            return this._heartbeatInfo;
        },
        /**
         * Available for backward compatibility, renamed to [Client#heartbeatIncoming]{@link Client#heartbeatIncoming}
         * [Client#heartbeatOutgoing]{@link Client#heartbeatOutgoing}.
         *
         * **Deprecated**
         */
        set: function (value) {
            this.heartbeatIncoming = value.incoming;
            this.heartbeatOutgoing = value.outgoing;
        },
        enumerable: true,
        configurable: true
    });
    return CompatClient;
}(Client));
export { CompatClient };
/**
 * @internal
 */
var HeartbeatInfo = /** @class */ (function () {
    function HeartbeatInfo(client) {
        this.client = client;
    }
    Object.defineProperty(HeartbeatInfo.prototype, "outgoing", {
        get: function () {
            return this.client.heartbeatOutgoing;
        },
        set: function (value) {
            this.client.heartbeatOutgoing = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeartbeatInfo.prototype, "incoming", {
        get: function () {
            return this.client.heartbeatIncoming;
        },
        set: function (value) {
            this.client.heartbeatIncoming = value;
        },
        enumerable: true,
        configurable: true
    });
    return HeartbeatInfo;
}());
//# sourceMappingURL=compat-client.js.map