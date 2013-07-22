var xbmc = require('xbmc');

module.exports = function(app){
  var connection = new xbmc.TCPConnection({
    host: '127.0.0.1',
    port: 9090,
    verbose: false
  });
  var xbmcApi = new xbmc.XbmcApi;

  xbmcApi.setConnection(connection);
  xbmcApi.on('connection:open', function()  { console.log('XBMC Connected');  });
  xbmcApi.on('connection:close', function() { console.log('XBMC Disconnected'); });
  xbmcApi.on('connection:data', function(json){
    if(json.method != undefined){
      console.log('Callback: '+json.method);
      var data = json.params.data;
      console.log(data);
    }
  });
  
  connection.send({ method:"Player.PlayPause", params:{ playerid:0 }, id:1 });
}
