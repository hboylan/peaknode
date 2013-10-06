var xbmc = require('xbmc')

function XBMC(config){
  this.connection, this.api, this.host = config.xbmc_host, this.port = config.xbmc_port;
  this.api = new xbmc.XbmcApi
  this.connect(true)
  this.controls = {
    'reboot'    :'System.Reboot',
    'shutdown'  :'System.Shutdown',
    'left'      :'Input.Left',
    'right'     :'Input.Right',
    'up'        :'Input.Up',
    'down'      :'Input.Down',
    'select'    :'Input.Select',
    'back'      :'Input.Back',
    'home'      :'Input.Home',
    'player'    :'GUI.SetFullscreen',
    'menu'      :'Input.ContextMenu',
  }
}

XBMC.prototype.connect = function(addListener){
  this.connection = new xbmc.TCPConnection({host:this.host, port:this.port, verbose:false})

  this.api.setConnection(this.connection)
  if(addListener){
    var self = this
    this.api.on('connection:open',  function() { console.log('XBMC connected') })
    this.api.on('connection:close', function() { console.log('XBMC disconnected') })
    this.api.on('connection:data', function(json){
      if(json.method != undefined){ //Log notifications
        console.log('XBMC !! ', json.method)
        console.log(json.params)
      }
    })
  }
}

XBMC.prototype.reconnect = function(res){
  var that = this
  this.api.disconnect(function(){
    that.connect(false)
    res.status(201).send()
  })
}
  
//Send JSON API command with parameters, return JSON response
XBMC.prototype.command = function(cmd, p, res){
  console.log('XBMC -> ', cmd)
  this.connection.send({ method:cmd, id:1, params:p }).then(function(data) { res.json(data.result) }, function(err){ res.json({ error:err })})
}
  
//Send JSON API command with parameters, execute callback function
XBMC.prototype.chain = function(cmd, p, fn){
  console.log('XBMC -> ', cmd)
  this.connection.send({ method:cmd, id:1, params:p }).then(fn)
}
//Request data from XBMC and handle the data in a callback
XBMC.prototype.request = function(cmd, p, fn, res){
  console.log('XBMC ?? ', cmd)
  this.connection.send({ method:cmd, id:1, params:p }).then(function(data) { fn(data) }, function(err){ res.json({ error:err }) })
}
// control cmd is a move function
XBMC.prototype.isMove = function(ctl){
  return ['toggle', 'previous', 'next', 'stop'].indexOf(ctl) > -1
}
  
XBMC.prototype.player = function(action, res){
  var self = this, cmd;
  self.chain('Player.GetActivePlayers', {}, function(d){
    if(!d.result.length) return res.status(401).json({ error:'No players detected' })
    var p = { playerid:d.result[0].playerid }
    if(action == 'toggle')
      cmd = 'Player.PlayPause'
    else if(action == 'next')
      cmd = 'Player.Move', p.direction = 'right';
    else if(action == 'previous')
      cmd = 'Player.Move', p.direction = 'left';
    else if(action == 'stop')
      cmd = 'Player.Stop'
    //Send Action
    self.command(cmd, p, res)
  })
}

module.exports = function(c){ return new XBMC(c) }