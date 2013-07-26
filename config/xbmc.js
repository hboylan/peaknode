var xbmc = require('xbmc');

function Client(){
  var connection, api, active = false;
  
  this.connect = function(){
    this.connection = undefined, this.api = undefined;
    this.connection = new xbmc.TCPConnection({
      host: '127.0.0.1',
      port: 9090,
      verbose: false
    }), this.api = new xbmc.XbmcApi;
  
    this.api.setConnection(this.connection);
    this.api.on('connection:open', function()  { this.active = true, console.log('XBMC Connected');  });
    this.api.on('connection:close', function() { this.active = false, console.log('XBMC Disconnected'); });
    this.api.on('connection:data', function(json){
      if(json.method != undefined) //Display callback methods
        console.log('XBMC: '+json.method+'\n'+json.params);
    })
  }

  this.command = function(cmd, p, res){
    this.connection.send({ method:cmd, id:1, params:p }).then(function(data){ res.json(data) })
  }
  
  this.chain = function(cmd, p, fn){
    this.connection.send({ method:cmd, id:1, params:p }).then(fn)
  }
  
  this.player = function(action, res){
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
        if(action == 'toggle')    cmd = 'Player.PlayPause';
        self.command(cmd, p, res)
      }
    })
  }
}

module.exports = function(app){
  var client = new Client();
  client.connect();

  app.get('/api/xbmc', function(req, res){
    // client.connect();
    client.player('state', res)
  })
  
  app.get('/api/xbmc/input/:action', function(req, res){
    var action = req.params.action;
    
    if(action == 'home')
      client.request('Input.Home', res)
    else if(action == 'left')
      client.request('Input.Left', res)
    else if(action == 'right')
      client.request('Input.Right', res)
    else if(action == 'up')
      client.request('Input.Up', res)
    else if(action == 'down')
      client.request('Input.Down', res)
    else if(action == 'back')
      client.request('Input.Back', res)
    else if(action == 'select')
      client.request('Input.Select', res)
  })
  
  app.get('/api/xbmc/playlists', function(req, res){
    client.chain('Playlist.GetItems', { playlistid:0 }, function(music){
      client.chain('Playlist.GetItems', { playlistid:1 }, function(videos){
        res.json({ music:music.result, video:videos.result })
      })
    })
  })
  
  app.get('/api/xbmc/scan', function(req, res){
    client.chain('AudioLibrary.Scan', {}, function(){
      client.chain('VideoLibrary.Scan', {}, function(v){
        res.json({ message:'Finished!' })
      })
    })
  })
  
  app.get('/api/xbmc/artists', function(req, res){
    client.request('AudioLibrary.GetArtists', res)
  })
  app.get('/api/xbmc/artists/:id', function(req, res){
    client.command('AudioLibrary.GetArtistDetails', { artistid:parseInt(req.params.id, 10) }, res)
  })
  
  app.get('/api/xbmc/albums', function(req, res){
    client.request('AudioLibrary.GetAlbums', res)
  })
  
  app.get('/api/xbmc/songs', function(req, res){
    client.request('AudioLibrary.GetSongs', res)
  })
  
  app.get('/api/xbmc/videos', function(req, res){
    client.request('VideoLibrary.GetMovies', res)
  })
  
  app.post('/api/xbmc', function(req, res){
    var action = req.body.action, p = { playerid:0 }, cmd, options = ['stop', 'play', 'toggle', 'next', 'back'];
    if(options.indexOf(action) == -1)
      res.json({ error:'Expected parameter: action', options:options })
      
    if(action == 'play'){
      var song  = req.body.songid
        , list  = req.body.playlistid
        , pos   = req.body.position, p = { item:{} };
      if(song == undefined && (list == undefined || pos == undefined))
        res.json({ error:'Expected songid or playlistid/position' })
      else if(song)
        p.item.songid = parseInt(song, 10);
      else
        p.item.playlistid = parseInt(list, 10), p.item.position = parseInt(pos, 10)
        console.log(p);
      client.command('Player.Open', p, res)
    }
    else if(action == 'reboot')
      client.command(action, {}, res)
    else
      client.player(action, res);
  })
}
