var config  = require('./config.json')
  , net     = require('net');

//Object containing our connection to the TCP server
var Client = function() {
  return {
    //Instance of our ongoing connection to the server
    connection: new net.Socket(),
    
    //Authenticate with the TCP server
    connect: function() {
      console.log('Attempting to reach the TCP server...');
      this.connection.connect(config.tcp_port, config.tcp_host, function() {
        this.write(config.tcp_key);
        console.log('TCP connection successful');
      });
      this.connection.on('data', function(d){
        console.log(d);
      });
      this.connection.on('close', function(){
        console.log('TCP Connection disconnected');
        this.reconnect(5);
        
      });
    },
    
    reconnect: function(attempts) {
      setTimeout(function(){
        this.connect();
        if(!this.connection.writable)
          this.reconnect(attempts--);
      }, 1000);
    },
    
    //Send message to the server
    send: function(msg) {
      this.connection.write(msg);
    },
    
    //Query the server expecting a response
    query: function(msg) {
      this.send(msg);
    }
  }
};

exports.client = function() {
  var client = new Client();
  client.connect();
  return client;
};
