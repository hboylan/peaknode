function API(client){
  this.status = function(req, res){ client.player('state', res) }
  this.reconnect = function(req, res){ client.reconnect(res) }
  
  this.songs    = function(req, res){ client.command('AudioLibrary.GetSongs', {}, res) }
  this.videos   = function(req, res){ client.command('VideoLibrary.GetMovies', {}, res) }
  this.artists  = function(req, res){ client.command('AudioLibrary.GetArtists', {}, res) }
  this.artist   = function(req, res){ client.command('AudioLibrary.GetArtistDetails', { artistid:parseInt(req.params.id, 10) }, res)
  this.albums   = function(req, res){ client.command('AudioLibrary.GetAlbums', {}, res) }
  this.album    = function(req, res){ client.command('AudioLibrary.GetAlbumDetails', { albumid:parseInt(req.params.id, 10) }, res)
  
  this.control = function(req, res){
    var control = req.params.ctl
      , isMove  = client.isMove(control)
      , isInput = client.isInput(control);
    if(isMove)
      client.player(control, res)
    else if(isInput)
      client.command('Input.'+control.charAt(0).toUpperCase(), {}, res)
    else if(control == 'play'){
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
    else if(control == 'reboot')
      client.command('System.Reboot', {}, res)
    else
      res.status(304).json({ error:'Invalid control command' })
  }
  
  this.playlists = function(req, res){
    client.chain('Playlist.GetItems', { playlistid:0 }, function(music){
      client.chain('Playlist.GetItems', { playlistid:1 }, function(videos){
        res.json({ music:music.result, video:videos.result })
      })
    })
  }
  
  this.scan = function(req, res){
    client.chain('AudioLibrary.Scan', {}, function(){
      client.chain('VideoLibrary.Scan', {}, function(v){
        res.json({ message:'Finished!' })
      })
    })
  }
}

exports.API = function(c) { return new API(c) }