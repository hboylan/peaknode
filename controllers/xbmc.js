function API(client){
  var songInf = ['duration', 'artist', 'album', 'thumbnail']
  var info = {
    song:songInf,
    player:['position', 'time', 'totaltime', 'playlistid', 'live'],
    movie:['runtime', 'thumbnail', 'file', 'resume'],
    playlist:songInf,
    artist:['thumbnail'],
    album:['thumbnail', 'year', 'title', 'albumlabel', 'artist']
  }
  
  this.status     = function(req, res){
    client.chain('Player.GetActivePlayers', {}, function(players){
      if(!players.result.length) res.json({ error:'No players detected' })
      else client.chain('Player.GetProperties', {properties:info.player, playerid:players.result[0].playerid}, function(player){
        var player = player.result
        res.json({ playlistid:player.playlistid, position:player.position, progress:3600*parseInt(player.time.hours)+60*parseInt(player.time.minutes)+parseInt(player.time.seconds) })
      })
    })
  }
  this.reconnect  = function(req, res){ client.reconnect(res) }
  this.movies   = function(req, res){ client.command('VideoLibrary.GetMovies', {properties:info.movie}, res) }
  this.movie    = function(req, res){ client.command('VideoLibrary.GetMovieDetails', {movieid:parseInt(req.params.id, 10), properties:info.song}, res) }
  this.songs    = function(req, res){ client.request('AudioLibrary.GetSongs', {properties:info.song, limits:{}}, function(data){ res.json(data.result.songs) }) }
  this.song     = function(req, res){ client.chain('AudioLibrary.GetSongDetails', {songid:parseInt(req.params.id, 10), properties:info.song}, function(s){ res.json(s.songDetails) }) }
  this.artists  = function(req, res){ client.command('AudioLibrary.GetArtists', {}, res) }
  this.artist   = function(req, res){ client.command('AudioLibrary.GetArtistDetails', {artistid:parseInt(req.params.id, 10)}, res) }
  this.albums   = function(req, res){ client.command('AudioLibrary.GetAlbums', {properties:info.album}, res) }
  this.album    = function(req, res){ client.command('AudioLibrary.GetAlbumDetails', {albumid:parseInt(req.params.id, 10)}, res) }
  this.dir      = function(req, res){ client.command('Files.GetDirectory', {directory:req.body.dir}, res) }
  
  this.control = function(req, res){
    var control = req.body.control
      , isMove  = client.isMove(control)
      , isInput = client.isInput(control)
      , isSys   = client.isSystem(control)
      , control = isMove? control:control.charAt(0).toUpperCase() + control.substring(1)
    if(isMove)
      client.player(control, res)
    else if(isInput)
      client.command('Input.'+control, {}, res)
    else if(isSys)
      client.command('System.'+control, {}, res)
    else
      res.status(304).json({ error:'Invalid control command' })
  }
  
  //Open individual song for playback
  this.playSong = function(req, res){
    var song = parseInt(req.params.id, 10)
    client.chain('AudioLibrary.GetSongDetails', {songid:song, properties:info.song}, function(data){
      if(data == undefined) res.status(401).json({ error:'Invalid songid:'+song })
      else client.command('Player.Open', {item:{ songid:song }}, res)
    })
  }
  
  this.playFile = function(req, res){
    client.command('Player.Open', {item:{file:req.body.file}}, res)
  }

  //List music, video playlists
  this.playlists = function(req, res){
    client.chain('Playlist.GetItems', { playlistid:0, properties:info.playlist }, function(music){
      client.chain('Playlist.GetItems', { playlistid:1 }, function(videos){
        res.json({ music:music.result.items, videos:videos.result })
      })
    })
  }
  
  //Open song a position within playlist
  this.playPlaylist = function(req, res){
    var list  = parseInt(req.params.listId, 10)
      , pos   = parseInt(req.params.pos, 10)
      , item  = { playlistid:list, position:pos };
    if(list == undefined) return res.status(401).json({ error:'Invalid listId' })
    if(pos == undefined)  return res.status(401).json({ error:'Invalid pos' })
    client.chain('Player.Open', {item:item}, function(d){
      if(d == 'OK') res.json({})
      else res.status(401).json({ error:'Failed to open' })
    })
  }
  
  //Re-Scan music, video libraries
  this.scan = function(req, res){
    client.chain('AudioLibrary.Scan', {}, function(){
      client.chain('VideoLibrary.Scan', {}, function(v){
        res.json({ message:'Sent scan command' })
      })
    })
  }
  
  this.insert = function(req, res){
    var list  = parseInt(req.params.listId, 10)
      , id    = parseInt(req.params.id, 10)
      , pos   = parseInt(req.params.pos, 10)
      , item  = list? {movieid:id}:{songid:id}
      , query = { playlistid:list, position:pos, item:item };
    if(list == undefined) return res.status(401).json({ error:'Invalid listId' })
    if(id == undefined)   return res.status(401).json({ error:'Invalid id' })
    if(pos == undefined)  return res.status(401).json({ error:'Invalid pos' })
    
    client.chain('Playlist.Insert', query, function(d){
      if(d.result.length) res.json({ success:'added: '+id })
      else res.status(201).json({ error:'Failed to insert' })
    })
  }
  
  this.remove = function(req, res){
    var list = parseInt(req.params.listId, 10)
      , pos  = parseInt(req.params.pos, 10);
    if(list == undefined) return res.status(401).json({ error:'Invalid listId' })
    if(pos == undefined)  return res.status(401).json({ error:'Invalid pos' })
    
    client.chain('Playlist.Remove', { playlistid:list, position:pos }, function(d){
      if(d.result.length) res.json({ success:'removed: '+pos })
      else res.status(201).json({ error:'Failed to remove' })
    })
  }
  
  this.clearPlaylist = function(req, res){
    client.command('Playlist.Clear', {}, apiHandle(res))
  }
}

module.exports = function(c){ return new API(c) }