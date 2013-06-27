var config  = require('./config.json')
  , net     = require('net');

//Object containing our connection to the TCP server
var Client = function() {
  return {
    //Instance of our ongoing connection to the server
    connection: new net.Socket(),
    
    //Authenticate with the TCP server
    connect: function() {
      this.connection.connect(config.tcp_port, config.tcp_host, function() {
        this.write(config.tcp_key);
        console.log('TCP Authentication successful');
      });
    },
    
    //Send message to the server
    send: function(s) {
      this.connection.write(s);
    }
  }
};

exports.client = function() {
  var client = new Client();
  client.connect();
  return client;
};