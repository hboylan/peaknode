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
        res.json({ playlistid:player.playlistid, position:player.position, progress:3600*parseInt(player.time.hours, 10)+60*parseInt(player.time.minutes, 10)+parseInt(player.time.seconds, 10) })
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
  // this.playSong = function(req, res){
  //   var song = parseInt(req.params.id, 10)
  //   client.chain('AudioLibrary.GetSongDetails', {songid:song, properties:info.song}, function(data){
  //     if(data == undefined) res.status(401).json({ error:'Invalid songid:'+song })
  //     else client.command('Player.Open', {item:{ songid:song }}, res)
  //   })
  // }
  
  this.playFile = function(req, res){
    client.command('Player.Open', {item:{file:req.body.file}}, res)
  }

  //List music, video playlists
  this.playlists = function(req, res){
    client.chain('Playlist.GetItems', { playlistid:0, properties:info.playlist }, function(music){
      client.chain('Playlist.GetItems', { playlistid:1 }, function(videos){
        var m = music.result.items
          , v = videos.result;
        m = m.length? music.result.items:[]
        res.json({ music:m, videos:v })
      })
    })
  }
  
  //Open song a position within playlist
  this.playPlaylist = function(req, res){
    var list  = parseInt(req.params.listId, 10)
      , place = req.params.place
      , pos   = place == 'next'? null:parseInt(place, 10)
      , item  = { playlistid:list, position:pos };
    if(list == undefined)   return res.status(401).json({ error:'Invalid listId' })
    if(place == undefined)  return res.status(401).json({ error:'Invalid pos' })
    
    if(place == 'next') 
      client.chain('Playlist.GetItems', {playlistid:list, properties:info.playlist}, function(d){
        item.position = d.result.limits.start+1
        client.chain('Player.Open', {item:item}, function(d){ res.json({}) })
      })
    else client.chain('Player.Open', {item:item}, function(d){ res.json({}) })
  }
  
  //Re-Scan music, video libraries
  this.scan = function(req, res){
    client.chain('AudioLibrary.Scan', {}, function(){
      client.chain('VideoLibrary.Scan', {}, function(v){
        res.json({ message:'Sent scan command' })
      })
    })
  }
  
  //insert either next, last, or at position
  this.insert = function(req, res){
    var list  = parseInt(req.params.listId, 10)
      , id    = parseInt(req.params.id, 10)
      , place = parseInt(req.params.place, 10)
      , item  = { playlistid:list, position:pos, item:list? {movieid:id}:{songid:id} };
    if(list == undefined) return res.status(401).json({ error:'Invalid listId' })
    if(id == undefined)   return res.status(401).json({ error:'Invalid id' })
    if(pos == undefined)  return res.status(401).json({ error:'Invalid pos' })
    
    client.chain('Playlist.GetItems', { playlistid:list, properties:info.playlist }, function(playlist){
      var results   = playlist.result
      item.position = req.params.place == 'next'? parseInt(results.limits.start, 10)+1:results.items.length;
      console.log('POSITION: ', position)
      client.chain('Playlist.Insert', item, function(d){ res.json({ success:'added: '+id }) })
    })
  }
  
  //used to move a song within playlist
  this.swap = function(req, res){
    var list  = parseInt(req.params.listId, 10)
      , id    = parseInt(req.params.id, 10)
      , pos1   = parseInt(req.params.pos1, 10)
      , pos2   = parseInt(req.params.pos2, 10);
    if(list == undefined) return res.status(401).json({ error:'Invalid listId' })
    if(id == undefined)   return res.status(401).json({ error:'Invalid id' })
    if(pos1 == undefined)  return res.status(401).json({ error:'Invalid pos1' })
    if(pos2 == undefined)  return res.status(401).json({ error:'Invalid pos2' })
  }
  
  //remove song from playlist
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
  
  //empty playlist
  this.clearPlaylist = function(req, res){
    client.command('Playlist.Clear', {}, apiHandle(res))
  }
}

module.exports = function(c){ return new API(c) }