var config  = require('./config.json')
  , net     = require('net');

//Object containing our connection to the TCP server
function Client() {

    //Instance of our ongoing connection to the server
    this.connection = new net.Socket();
    
    //Authenticate with the TCP server
    this.connect = function() {
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
        //reconnect(5);
        
      });
    };
    
    this.reconnect = function(attempts) {
      setTimeout(function(){
        this.connect();
        if(!this.connection.writable)
          this.reconnect(attempts--);
      }, 1000);
    };
    
    //Send message to the server
    this.send = function(msg) {
      this.connection.write(msg);
    };
    
    //Query the server expecting a response
    this.query = function(msg) {
      this.send(msg);
    };

};

exports.client = function() {
  var client = new Client();
  client.connect();
  return client;
};
