id = 0;

stompClient = function () {
  const myId = ++id;

  const stompConfig = {
    connectHeaders: {
      login: TEST.login,
      passcode: TEST.password,
    },
    brokerURL: TEST.url,
    // To test STOMP over TCP
    // webSocketFactory: () => new TCPWrapper('127.0.0.1', 61613),
    debug: function (str) {
      console.log('CLIENT ' + myId + ': ' + str);
    },
    reconnectDelay: 0,
  };
  return new StompJs.Client(stompConfig);
};

badStompClient = function () {
  const client = stompClient();
  // brokerURL is also provided, in this case webSocketFactory should get used
  client.webSocketFactory = function () {
    return new WebSocket(TEST.badUrl);
  };
  return client;
};

// This itself is important, if for some reason, deactivate does not complete, the jasmine test will timeout
// Ensure this is called as await in an async function.
disconnectStomp = async function (client) {
  if (client) {
    await client.deactivate();
  }
};

saveOrigFactory = client => {
  if (!client._origFactory) {
    client._origFactory =
      client.webSocketFactory ||
      (() =>
        new WebSocket(
          client.brokerURL,
          client.stompVersions.protocolVersions()
        ));
  }
};

overRideFactory = (client, CLS) => {
  saveOrigFactory(client);

  client.webSocketFactory = () => new CLS(client._origFactory());
};
