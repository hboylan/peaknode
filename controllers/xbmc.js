function API(client){
  var songInf = ['duration', 'artist', 'album', 'thumbnail']
  var info = {
    song:songInf,
    player:['position', 'time', 'totaltime', 'playlistid', 'live'],
    movie:['runtime', 'thumbnail', 'file', 'resume'],
    playlist:songInf,
    album:['thumbnail', 'year', 'title', 'albumlabel', 'artist'],
    show:['title', 'file', 'fanart', 'thumbnail', 'season', 'episode']
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
  this.videos   = function(req, res){
    client.request('VideoLibrary.GetMovies', {properties:info.movie}, function(m){
      client.request('VideoLibrary.GetTVShows', {}, function(t){
        res.json({ movies:m.result.movies, shows:t.result.tvshows })
      })
    }) 
  }
  this.movies   = function(req, res){ client.request('VideoLibrary.GetMovies', {properties:info.movie}, function(m){ res.json({ movies:m.result.movies }) }) }
  this.episodes = function(req, res){ client.request('VideoLibrary.GetEpisodes', {tvshowid:req.params.id, properties:info.shows}, function(e){ res.json({ episodes:e.result.episodes }) }) }
  this.reconnect  = function(req, res){ client.reconnect(res) }
  this.video    = function(req, res){ client.command('VideoLibrary.GetMovieDetails', {movieid:parseInt(req.params.id, 10), properties:info.song}, res) }
  this.songs    = function(req, res){ client.request('AudioLibrary.GetSongs', {properties:info.song, limits:{}}, function(data){ res.json(data.result.songs) }) }
  this.song     = function(req, res){ client.chain('AudioLibrary.GetSongDetails', {songid:parseInt(req.params.id, 10), properties:info.song}, function(s){ res.json(s.songDetails) }) }
  this.artists  = function(req, res){ client.request('AudioLibrary.GetArtists', {}, function(a){ res.json(a.result.artists) }) }
  this.artist   = function(req, res){ client.command('AudioLibrary.GetArtistDetails', {artistid:parseInt(req.params.id, 10)}, res) }
  this.albums   = function(req, res){ client.command('AudioLibrary.GetAlbums', {properties:info.album}, res) }
  this.album    = function(req, res){ client.command('AudioLibrary.GetAlbumDetails', {albumid:parseInt(req.params.id, 10)}, res) }
  this.dir      = function(req, res){ client.command('Files.GetDirectory', {directory:req.body.dir}, res) }
  
  this.control = function(req, res){
    var control = req.body.control
      , isMove  = client.isMove(control)
      , isInput = client.isInput(control)
      , isSys   = client.isSystem(control)
      , control = isInput || isSys? control:control.charAt(0).toUpperCase() + control.substring(1);
    if(isMove)
      client.player(control, res)
    else if(isInput)
      client.command('Input.'+control, {}, res)
    else if(isSys)
      client.command('System.'+control, {}, res)
    else
      res.status(401).json({ error:'Invalid control command' })
  }
  
  this.scan = function(req, res){
    client.chain('AudioLibrary.Scan', {}, function(){
      client.chain('VideoLibrary.Scan', {}, function(v){
        res.json({ message:'Sent scan command' })
      })
    })
  }
  
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
        console.log(d.result.limits)
        item.position = d.result.limits.start+1
        client.chain('Player.Open', {item:item}, function(d){ res.json({}) })
      })
    else client.chain('Player.Open', {item:item}, function(d){ res.json({}) })
  }
  
  //insert either next, last, or at position
  this.insert = function(req, res){
    var list  = parseInt(req.params.listId, 10)
      , id    = parseInt(req.params.id, 10)
      , pos   = parseInt(req.params.pos, 10)
      , item  = { playlistid:list, position:pos, item:list? {movieid:id}:{songid:id} };
    if(list == undefined) return res.status(401).json({ error:'Invalid listId' })
    if(id == undefined)   return res.status(401).json({ error:'Invalid id' })
    if(pos == undefined)  return res.status(401).json({ error:'Invalid pos' })

    client.chain('Playlist.Insert', item, function(d){ res.json({ success:'added: '+id }) })
  }
  
  //used to move a song within playlist
  this.swap = function(req, res){
    var query = { playlistid:parseInt(req.params.listId, 10), position1:parseInt(req.params.pos1, 10), position2:parseInt(req.params.pos2, 10) };
    if(query.playlistid == undefined) return res.status(401).json({ error:'Invalid listId' })
    if(query.position1 == undefined)  return res.status(401).json({ error:'Invalid pos1' })
    if(query.position2 == undefined)  return res.status(401).json({ error:'Invalid pos2' })
    
    client.chain('Playlist.Swap', query, function(d){
      res.json({ success:'swapped' })
    })
  }
  
  //remove song from playlist
  this.remove = function(req, res){
    var query = { playlistid:parseInt(req.params.listId, 10), position:parseInt(req.params.pos, 10) };
    if(query.playlistid == undefined) return res.status(401).json({ error:'Invalid listId' })
    if(query.position == undefined)  return res.status(401).json({ error:'Invalid pos' })

    client.chain('Playlist.Remove', query, function(d){
      res.json({ success:'removed: '+query.position })
    })
  }
  
  //empty playlist
  this.clearPlaylist = function(req, res){
    client.command('Playlist.Clear', {}, apiHandle(res))
  }
}

module.exports = function(c){ return new API(c) }