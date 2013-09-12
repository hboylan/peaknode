function API(client){
  var info = {
    movie:['runtime', 'thumbnail', 'file', 'resume'],
    song:['duration', 'artist', 'album', 'file', 'thumbnail'],
    artist:['']
  }
  
  this.status     = function(req, res){ client.command('Player.GetActivePlayers', {}, res) }
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
    client.command('Player.Open', {item:{ songid:parseInt(req.params.songid, 10) }}, res)
  }
  
  this.playFile = function(req, res){
    client.command('Player.Open', {item:{file:req.body.file}}, res)
  }
  
  //Open song a position within playlist
  this.playPlaylist = function(req, res){
    var list  = req.body.playlistid
      , pos   = req.body.position
    if(false) res.json({ error:'Expected playlistid/position' })
    client.command('Player.Open', {item:{ playlistid:parseInt(list, 10), position:parseInt(pos, 10) }}, res)
  }
  
  //List music, video playlists
  this.playlists = function(req, res){
    client.chain('Playlist.GetItems', { playlistid:0 }, function(music){
      client.chain('Playlist.GetItems', { playlistid:1 }, function(videos){
        res.json({ music:music.result, video:videos.result })
      })
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
  
  this.clear = function(req, res){
    client.command('Playlist.Clear', {}, apiHandle(res))
  }
}

module.exports = function(c){ return new API(c) }