function API(client){
  this.status = function(req, res){ client.player('state', res) }
  
  this.songs = function(req, res){ client.command('AudioLibrary.GetSongs', {}, res) }
}

exports.API = API;
  
  // app.get('/api/xbmc/input/:action', function(req, res){
  //   var action = req.params.action;
  //   
  //   if(action == 'home')
  //     client.request('Input.Home', res)
  //   else if(action == 'left')
  //     client.request('Input.Left', res)
  //   else if(action == 'right')
  //     client.request('Input.Right', res)
  //   else if(action == 'up')
  //     client.request('Input.Up', res)
  //   else if(action == 'down')
  //     client.request('Input.Down', res)
  //   else if(action == 'back')
  //     client.request('Input.Back', res)
  //   else if(action == 'select')
  //     client.request('Input.Select', res)
  // })
  // 
  // app.get('/api/xbmc/playlists', function(req, res){
  //   client.chain('Playlist.GetItems', { playlistid:0 }, function(music){
  //     client.chain('Playlist.GetItems', { playlistid:1 }, function(videos){
  //       res.json({ music:music.result, video:videos.result })
  //     })
  //   })
  // })
  // 
  // app.get('/api/xbmc/scan', function(req, res){
  //   client.chain('AudioLibrary.Scan', {}, function(){
  //     client.chain('VideoLibrary.Scan', {}, function(v){
  //       res.json({ message:'Finished!' })
  //     })
  //   })
  // })
  // 
  // app.get('/api/xbmc/artists', function(req, res){
  //   client.request('AudioLibrary.GetArtists', res)
  // })
  // app.get('/api/xbmc/artists/:id', function(req, res){
  //   client.command('AudioLibrary.GetArtistDetails', { artistid:parseInt(req.params.id, 10) }, res)
  // })
  // 
  // app.get('/api/xbmc/albums', function(req, res){
  //   client.request('AudioLibrary.GetAlbums', res)
  // })
  // 
  // app.get('/api/xbmc/videos', function(req, res){
  //   client.request('VideoLibrary.GetMovies', res)
  // })
  // 
  // app.post('/api/xbmc', function(req, res){
  //   var action = req.body.action, p = { playerid:0 }, cmd, options = ['stop', 'play', 'toggle', 'next', 'back'];
  //   if(options.indexOf(action) == -1)
  //     res.json({ error:'Expected parameter: action', options:options })
  //     
  //   if(action == 'play'){
  //     var song  = req.body.songid
  //       , list  = req.body.playlistid
  //       , pos   = req.body.position, p = { item:{} };
  //     if(song == undefined && (list == undefined || pos == undefined))
  //       res.json({ error:'Expected songid or playlistid/position' })
  //     else if(song)
  //       p.item.songid = parseInt(song, 10);
  //     else
  //       p.item.playlistid = parseInt(list, 10), p.item.position = parseInt(pos, 10)
  //       console.log(p);
  //     client.command('Player.Open', p, res)
  //   }
  //   else if(action == 'reboot')
  //     client.command(action, {}, res)
  //   else
  //     client.player(action, res);
  // })