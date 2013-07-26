var config  = require('../config.json')
  , net     = require('net');

//Object containing our connection to the TCP server
function OmniClient() {
  this.connection = new net.Socket();
  this.connection.setEncoding('utf-8')
  this.connection.on('error', function (e) { })
  this.connection.on('data', function(msg){ console.log('OMNI -> '+msg) })
  this.connection.on('close', function(){ console.log('OMNI disconnected') })
  
  this.connect()
}

//Authenticate client with the TCP server
OmniClient.prototype.connect = function(){
  this.connection.connect(config.tcp_port, config.tcp_host, function() {
    this.write(config.tcp_key)
    console.log('OMNI connected 0.0.0.0:'+config.tcp_port)
  })
}

OmniClient.prototype.reconnect = function(attempts) {
  if(attempts > 0) setTimeout(function(){
    this.connect()
    if(!this.connection.writable)
      this.reconnect(attempts--)
  }, 1000)
}

//Send message to the server
OmniClient.prototype.send = function(json) {
  var conn = this.connection, str = JSON.stringify(json);
  if(conn.writable){
    this.connection.write(str)
    console.log('OMNI <- '+str)
  }
  else console.log('OMNI X '+str)
}

OmniClient.prototype.command = function(cmd, data){
  this.send({ node:'omnilink', command:cmd, params:data })
}

module.exports = new OmniClient;
