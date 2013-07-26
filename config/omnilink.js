var config  = require('./config.json')
  , net     = require('net');

//Object containing our connection to the TCP server
function OmniClient() {

    //Instance of our ongoing connection to the server
    this.connection = new net.Socket();
    this.connection.setEncoding('utf-8');
    this.connection.on('error', function (e) {
      
    })
    this.connection.on('data', function(msg){
      console.log("TCP connection received: '"+msg+"'");
    })
    this.connection.on('close', function(){
      console.log('TCP connection closed');
      //reconnect(5);
    })
    
    //Authenticate client with the TCP server
    this.connect = function() {
      console.log('Attempting to reach TCP server on port '+config.tcp_port+'...');
      this.connection.connect(config.tcp_port, config.tcp_host, function() {
        this.write(config.tcp_key);
        console.log('TCP connection successful');
      });
    }
    
    this.reconnect = function(attempts) {
      if(attempts > 0) setTimeout(function(){
        this.connect();
        if(!this.connection.writable)
          this.reconnect(attempts--);
      }, 1000);
    }
    
    //Send message to the server
    this.send = function(json) {
      var conn = this.connection;
      if(conn.writable)
        this.connection.write(JSON.stringify(json));
      else
        console.log('TCP client failed to send:');
      console.log(json);
    }
    
    this.command = function(cmd, data){
      this.send({ node:'omnilink', command:cmd, params:data })
    }
};

module.exports = function(app) {
  var client = new OmniClient();
  client.connect();
  app.set('omni', client);
}
