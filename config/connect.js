var config  = require('./config.json')
  , net     = require('net');

module.exports = function(app){
  var connection = new net.Socket();
  connection.connect(config.tcp_port, config.tcp_host, function() {
    this.write(config.tcp_key);
    console.log('TCP Authentication successful');
  });
  
  var send = function(msg){
    connection.write(msg);
  };
  app.set('tcp', send);
};