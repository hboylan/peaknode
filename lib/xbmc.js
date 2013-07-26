var xbmc = require('xbmc');

function XBMC(){
  var connection, api, active = false;
  this.connect()
}

XBMC.prototype.connect = function(){
  this.connection = undefined, this.api = undefined;
  this.connection = new xbmc.TCPConnection({
    host: '127.0.0.1',
    port: 9090,
    verbose: false
  }), this.api = new xbmc.XbmcApi;

  this.api.setConnection(this.connection);
  this.api.on('connection:open', function()  { this.active = true, console.log('XBMC connected');  })
  this.api.on('connection:close', function() { this.active = false, console.log('XBMC disconnected'); })
  this.api.on('connection:data', function(json){
    if(json.method != undefined){ //Log notifications
      console.log('XBMC: '+json.method)
      console.log(json.params)
    }
  })
}
  
//Send JSON API command with parameters, return JSON response
XBMC.prototype.command = function(cmd, p, res){
  this.connection.send({ method:cmd, id:1, params:p }).then(function(data) { res.json(data) })
}
  
//Send JSON API command with parameters, execute callback function
XBMC.prototype.chain = function(cmd, p, fn){
  this.connection.send({ method:cmd, id:1, params:p }).then(fn)
}
  
//TODO
//Revisit player logic so that 
//Add try/except block on calls
XBMC.prototype.player = function(action, res){
  var p = { playerid:0 }, self = this, cmd;
  self.chain('Player.GetActivePlayers', {}, function(d){
    if(!d.result.length) return res.json({ error:'No players detected' })
    var player = d.result[0]
    
    if(player.playerid == 0){ //Music
      self.chain('Player.GetItem', p, function(player){
        if(action == 'toggle')      cmd = 'Player.PlayPause';
        else if(action == 'next')   cmd = 'Player.Move', p.direction = 'right';
        else if(action == 'back')   cmd = 'Player.Move', p.direction = 'left';
        else if(action == 'stop')   cmd = 'Player.Stop';
        else if(action == 'state')  return res.json({ player:d.result[0], item:player.result.item })
        else return res.json({ error:'Invalid action: '+action })
        //Send Action
        self.command(cmd, p, res)
      })
    }
    else if(player.playerid == 1){ //Video
      // if(action == 'toggle') cmd = 'Player.PlayPause';
      // self.command(cmd, p, res)
      res.json(player)
    }
  })
}

module.exports = new XBMC;