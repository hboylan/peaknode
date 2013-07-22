var xbmc = require('xbmc');

module.exports = function(app){
  var connection, api;

  function connect(){
    connection = undefined, api = undefined;
    connection = new xbmc.TCPConnection({
      host: '127.0.0.1',
      port: 9090,
      verbose: false
    }), api = new xbmc.XbmcApi;
    
    api.setConnection(connection);
    api.on('connection:open', function()  { console.log('XBMC Connected');  });
    api.on('connection:close', function() { console.log('XBMC Disconnected'); });
    api.on('connection:data', function(json){
      if(json.method != undefined)
        console.log('XBMC: '+json.method+'\n'+json.params);
    });
  }
  
  function command(cmd, res){
    connection.send({ method:cmd, id:1 }).then(function(data){ res.json(data) })
  }
  
  function request(cmd, res){
    connection.send({ method:cmd, id:1 }).then(function(data){ res.json(data) })
  }
  
  function query(cmd, p, res){
    // setTimeout(function(){ res.json({ error:'timeout' }) }, 1500)
    connection.send({ method:cmd, id:1, params:p }).then(function(data){ res.json(data) })
  }
  
  function chain(cmd, p, fn){
    connection.send({ method:cmd, id:1, params:p }).then(fn)
  }
  
  app.get('/api/xbmc', function(req, res){
    connect()
    request('Player.GetActivePlayers', res)
  })
  
  app.get('/api/xbmc/playlists', function(req, res){
    chain('Playlist.GetItems', { playlistid:0 }, function(music){
      chain('Playlist.GetItems', { playlistid:1 }, function(videos){
        res.json({ music:music.result, video:videos.result })
      })
    })
  })
  
  app.get('/api/xbmc/artists', function(req, res){
    request('AudioLibrary.GetArtists', res)
  })
  app.get('/api/xbmc/artists/:id', function(req, res){
    query('AudioLibrary.GetArtistDetails', { artistid:parseInt(req.params.id, 10) }, res)
  })
  
  app.get('/api/xbmc/albums', function(req, res){
    request('AudioLibrary.GetAlbums', res)
  })
  
  app.get('/api/xbmc/songs', function(req, res){
    request('AudioLibrary.GetSongs', res)
  })
  
  app.get('/api/xbmc/songs/:id', function(req, res){
    query('Player.Open', { item:{ songid:parseInt(req.params.id, 10) } }, res)
  })
  
  app.get('/api/xbmc/videos', function(req, res){
    request('VideoLibrary.GetMovies', res)
  })
  
  app.post('/api/xbmc/play', function(req, res){
    var song  = req.body.songid
      , list  = req.body.playlistid
      , pos   = req.body.position;
    if(song == undefined && (list == undefined || pos == undefined)) res.json({ error:'Expected songid, playlistid/position' })
    
    if(song)
      query('Player.Open', { item:{ songid:parseInt(song, 10) }}, res)
    query('Player.Open', { item:{ playlistid:parseInt(list, 10), position:parseInt(pos, 10) }}, res)
  })
  
  app.post('/api/xbmc', function(req, res){
    var action = req.body.action, p = { playerid:0 }, cmd;
    
    if(action == 'stop')
      cmd = 'Player.Stop';
    else if(action == 'toggle')
      cmd = 'Player.PlayPause';
    else if(action == 'next')
      cmd = 'Player.Move', p.direction = 'right';
    else if(action == 'back')
      cmd = 'Player.Move', p.direction = 'left';
    
    query(cmd, p, res)
  })
  
  connect();
}
