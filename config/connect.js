var config  = require('./config.json')
  , net     = require('net');

//Object containing our connection to the TCP server
function Client() {

    //Instance of our ongoing connection to the server
    this.connection = new net.Socket();
    this.connection.setEncoding('utf-8');
    this.connection.on('error', function (e) {
      if(e.code == 'ECONNREFUSED')
        console.log('TCP server offline');
    });
    this.connection.on('data', function(msg){
      console.log("TCP connection received: '"+msg+"'");
    });
    this.connection.on('close', function(){
      console.log('TCP connection closed');
      //reconnect(5);
    });
    
    //Authenticate client with the TCP server
    this.connect = function() {
      console.log('Attempting to reach TCP server on port '+config.tcp_port+'...');
      this.connection.connect(config.tcp_port, config.tcp_host, function() {
        this.write(config.tcp_key);
        console.log('TCP connection successful');
      });
    };
    
    this.reconnect = function(attempts) {
      if(attempts > 0) setTimeout(function(){
        this.connect();
        if(!this.connection.writable)
          this.reconnect(attempts--);
      }, 1000);
    };
    
    //Send message to the server
    this.send = function(msg) {
      var conn = this.connection;
      if(conn.writable)
        this.connection.write(msg);
      else
        console.log("TCP client failed to send: '"+msg+"'");
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
