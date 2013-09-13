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
  this.artists  = function(req, res){ client.command('AudioLibrary.GetArtists', {}, res) }
  this.artist   = function(req, res){ client.command('AudioLibrary.GetArtistDetails', {artistid:parseInt(req.params.id, 10)}, res) }
  this.albums   = function(req, res){ client.command('AudioLibrary.GetAlbums', {}, res) }
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
    var song = parseInt(req.body.songid, 10)
    client.chain('AudioLibrary.GetSongDetails', {properties:info.song}, function(data){
      if(!data.results.length) res.status(401).json({ error:'Invalid songid:'+song })
      else client.command('Player.Open', {item:{ songid:parseInt(song, 10) }}, res)
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
    var list  = req.params.playlistid
      , pos   = req.params.position
    if(false) res.json({ error:'Expected playlistid/position' })
    client.command('Player.Open', {item:{ playlistid:parseInt(list, 10), position:parseInt(pos, 10) }}, res)
  }
  
  //Re-Scan music, video libraries
  this.scan = function(req, res){
    client.chain('AudioLibrary.Scan', {}, function(){
      client.chain('VideoLibrary.Scan', {}, function(v){
        res.json({ message:'Sent scan command' })
      })
    })
  }
  
  //TODO
  //Add list of songs, movies to a playlist
  this.add = function(req, res){
    var list  = parseInt(req.params.id, 10)
      , items = req.body.items.split(', ')
    console.log(items)
    for(i in items){
      var next = parseInt(items[i], 10), obj;
      if(list == 0)
        obj = {songid:next}
      else if(list == 1)
        obj = {movieid:next}
      client.chain('Playlist.Add', {playlistid:list, item:obj}, function(){})
    }
    res.json('done')
  }
  
  this.clearPlaylist = function(req, res){
    client.command('Playlist.Clear', {}, apiHandle(res))
  }
}

module.exports = function(c){ return new API(c) }