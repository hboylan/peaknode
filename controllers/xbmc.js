function API(client){
  var info = {
    song:['duration', 'artist', 'album', 'thumbnail'],
    player:['position', 'time', 'totaltime', 'playlistid', 'canseek'],
    movie:['duration', 'thumbnail', 'file', 'resume'],
    album:['thumbnail', 'year', 'title', 'albumlabel', 'artist'],
    show:['title', 'file', 'fanart', 'thumbnail', 'season', 'episode']
  }
  
  this.status     = function(req, res){
    client.chain('Player.GetActivePlayers', {}, function(players){
      if(!players.result.length) res.json({ message:'Inactive' })
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
  this.shows    = function(req, res){ client.request('VideoLibrary.GetTVShows', {properties:info.show}, res, function(s){ res.json(s.result.tvshows) }) }
  this.movies   = function(req, res){ client.request('VideoLibrary.GetMovies', {properties:info.movie}, res, function(m){ res.json(m.result.movies) }) }
  this.episodes = function(req, res){ client.request('VideoLibrary.GetEpisodes', {tvshowid:req.params.id, properties:info.shows}, res, function(e){ res.json({ episodes:e.result.episodes }) }) }
  this.reconnect= function(req, res){ client.reconnect(res) }
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
      , isMove  = client.isMove(control);
    if(isMove)
      client.player(control, res)
    else if(control in client.controls)
      client.command(client.controls[control], {}, res)
    else
      res.status(401).json({ error:'Invalid control command' })
  }
  
  this.scan = function(req, res){
    client.chain('AudioLibrary.Scan', {}, function(){
      client.chain('VideoLibrary.Scan', {}, function(){
        res.json({ error:'sent scan command' })
      })
    })
  }
  
  //List music, video playlists
  this.playlist = function(req, res){
    var list = parseInt(req.params.listId, 10)
    client.chain('Playlist.GetItems', {playlistid:list, properties:list? info.movie:info.song}, function(r){
      res.json(r.result.limits.total? r.result.items:[])
    })
  }
  
  //Open song a position within playlist
  this.playPlaylist = function(req, res){
    var list  = parseInt(req.params.listId, 10)
      , pos   = parseInt(req.params.pos, 10)

    client.chain('Player.Open', { item:{playlistid:list, position:pos} }, function(d){ res.send() })
  }
  
  this.playSong = function(req, res){
    var list  = parseInt(req.params.listId, 10)
      , id    = parseInt(req.params.id, 10)
    function inPlay(position){
      client.chain('Playlist.Insert', { playlistid:list, item:list? {movieid:id}:{songid:id}, position:position }, function(d){
        client.chain('Player.Open', { item:{playlistid:list, position:position} }, function(d){ res.send() })
      })
    }
    
    client.chain('Player.GetActivePlayers', {}, function(players){ //Check is there's a playlist
      if(players.result.length) //insert next
        client.chain('Player.GetProperties', {properties:info.player, playerid:list}, function(player){
          inPlay(player.result.position+1)
        })
      else inPlay(0) //insert first
    })
  }
  
  //insert either next, last
  this.insert = function(req, res){
    var list  = parseInt(req.params.listId, 10)
      , id    = parseInt(req.params.id, 10)
      , place = req.params.place
      , item  = { playlistid:list, item:list? {movieid:id}:{songid:id}, position:0 }
    
    client.chain('Player.GetActivePlayers', {}, function(players){ //Check is there's a playlist
    
      if(players.result.length)
        client.chain('Player.GetProperties', {properties:info.player, playerid:list}, function(player){
          
          if(place == 'next') //insert next
          {
            item.position = player.result.position+1
            client.chain('Playlist.Insert', item, function(d){ res.json({ success:'added: '+id }) })
          }
          else //insert last
            client.chain('Playlist.GetItems', {playlistid:list, properties:list? info.movie:info.song}, function(p){
              item.position = p.result.limits.end
              client.chain('Playlist.Insert', item, function(d){ res.json({ success:'added: '+id }) })
            })
        })
      else client.chain('Playlist.Insert', item, function(d){ res.json({ success:'added: '+id }) }) //Nothing playing, insert
    })
  }
  
  //used to move a song within playlist
  this.swap = function(req, res){    
    client.chain('Playlist.Swap', {
      playlistid:parseInt(req.params.listId, 10),
      position1:parseInt(req.params.pos1, 10),
      position2:parseInt(req.params.pos2, 10)
    }, function(d){ res.json({ success:true }) })
  }
  
  //remove song from playlist
  this.remove = function(req, res){
    var query = { playlistid:parseInt(req.params.listId, 10), position:parseInt(req.params.pos, 10) }

    client.chain('Playlist.Remove', query, function(d){
      res.json({ success:'removed: '+query.position })
    })
  }
  
  this.seek = function(req, res){
    var progress = parseInt(req.params.progress, 10)

    client.chain('Player.GetActivePlayers', {}, function(players){
      if(!players.result.length) res.json({ message:'Inactive' })
      else client.chain('Player.GetProperties', {properties:info.player, playerid:players.result[0].playerid}, function(player){
        
      })
    })
  }
}

module.exports = function(c){ return new API(c) }