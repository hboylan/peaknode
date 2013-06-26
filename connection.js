var net = require('net');

var Client = function(c) {
  return {
    config: c,
    connection: new net.Socket(),
    connect: function() {
      var client = this.connection;
      var clientConfig = this.config;
      client.connect(this.config.port, this.config.host, function() {
        client.write(clientConfig.secret);
        console.log('TCP Authentication successful');
      }); 
    },
    send: function(s) {
      var client = this.connection;
      client.write(s);
    }
  };
}

exports.client = function(c) {
  return new Client(c);
}