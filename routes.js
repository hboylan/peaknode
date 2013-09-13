module.exports = function(app, sessions, db, omni_client, fit_client, xbmc_client) {
  var users   = require('./controllers/users')(db, fit_client)
    , zones   = require('./controllers/zones')(db)
    , audio   = require('./controllers/audio')(db, omni_client)
    , lights  = require('./controllers/lights')(db, omni_client)
    , fitbit  = require('./controllers/fitbit')(db, fit_client)
    , xbmc    = require('./controllers/xbmc')(xbmc_client)
    , vera    = require('./controllers/vera')(db, require('./config.json').vera_host)
    , sec     = require('./controllers/security')(db, vera, omni_client)
    , appliances = require('./controllers/appliances')(db, vera)

  /*** Authentication Wrappers ***/  
  //Require user authentication
  function reqLogin(callback){
    return function(req, res){
      var sessID;
      if(req.method == 'POST')      sessID = req.body.sessionID
      else if(req.method == 'GET')  sessID = req.query.sessionID

      if(callback == users.login || callback == users.logout){
        if(sessID) sessions.destroy(sessID, function(err, sess){})
        callback(req, res)
      }
      else
        sessions.get(sessID, function(err, sess){
          if(sess == undefined) res.status(401).end()
          else callback(req, res)
        })
    }
  }
  
  //Require valid auth token
  function reqToken(callback){
    return function(req, res){
      // if(auth == undefined) res.status(401).json({ error:'Requires admin token' })
      // else if(new Date() > new Date(auth.timeout)) res.status(401).json({ error:'Expired admin token' })
      // else 
      callback(req, res)
    }
  }
  
  //Require persistant fitbit access token
  function reqFitbit(callback, access){
    return function(req, res){
      var sessID = req.query.sessionID
      if(sessID == undefined) return res.status(401).json({ error:'Invalid sessionID' })
      sessions.get(sessID, function(err, sess){
        if(sess == undefined) res.status(401).json({ error:'Invalid sessionID' })
        else if(access) callback(sess.user.id, req, res)
        else if(sess.fitbit != undefined) callback(sess.fitbit, req, res)
        else res.status(401).json({ error:'Requires fitbit access token'})
      })
    }
  }
  
  //Require POST parameters be set
  function reqBody(callback, params){
    return function(req, res){
      var err = false
      params.forEach(function(p){ if(req.body[p] == undefined) err = true })
      return err? res.status(401).json({ error:'Requires POST params: '+params.join(', ') }) : callback(req, res)
    }
  }

  /*** API ***/
  //Vera API
  app.get('/vera', vera.request)
  app.get('/vera/nodes', vera.list)
  app.get('/vera/nodes/:id', vera.show)
  app.post('/vera/nodes/:id', vera.state)
  
  // users
  app.post('/auth', reqBody(function(req, res){
    sessions.get(req.body.sessionID, function(err, sess){
      if(sess != undefined) res.send()
      else res.status(401).end()
    })
  }, ['sessionID']))
  app.get('/resync', db.resync)
  app.get('/users', users.list)
  app.post('/users', reqBody(users.create, ['username', 'password', 'realname', 'pinkey']))
  app.post('/login', reqBody(users.login, ['username', 'password']))
  app.post('/logout', reqLogin(users.logout))
  app.post('/unlock', reqBody(reqLogin(users.unlock), ['id', 'pinkey']))
  app.get('/users/:id', users.show)
  
  // zones
  app.get('/zones', zones.list)
  app.get('/zones/:id', zones.show)
  
  // appliances
  app.get('/appliances', appliances.list)
  app.get('/appliances/:id', appliances.show)
  app.post('/appliances/:id', appliances.switch)
  
  // audio
  app.get('/audio', reqLogin(audio.list))
  app.post('/audio', reqLogin(audio.state))
  app.get('/audio/:id', reqLogin(audio.zone))
  
  //security
  app.get('/security', sec.status)
  app.post('/security', reqBody(sec.setStatus, ['id', 'pinkey', 'state']))
  app.post('/security/:lockId', reqBody(sec.setStatus, ['id', 'pinkey', 'state']))
  
  //lighting
  app.get('/lights', reqLogin(lights.list))
  // app.post('/lights', lights.create)
  app.get('/lights/:id', reqLogin(lights.show))
  app.post('/lights', reqLogin(lights.state))
  // app.post('/lights/:id/:action', lights.timeout)
  
  //fitbit
  app.get('/fitbit/hastoken', reqFitbit(fitbit.hasToken, true))
  app.get('/fitbit/access', reqFitbit(fitbit.access, true))
  app.get('/fitbit/:action', reqFitbit(fitbit.userAction))
  app.get('/fitbit/:action/:sub', reqFitbit(fitbit.userSubAction))
  app.get('/fitbit/:action/:sub/date/:start/:end', reqFitbit(fitbit.dateRange))
  
  //xbmc
  app.get('/xbmc', xbmc.status)
  app.post('/xbmc', reqLogin(xbmc.control))
  app.get('/xbmc/reconnect', xbmc.reconnect)
  app.get('/xbmc/dir', xbmc.dir)
  app.get('/xbmc/scan', xbmc.scan)
  app.get('/xbmc/songs', xbmc.songs)
  app.post('/xbmc/song/:id', reqLogin(xbmc.playSong))
  app.get('/xbmc/movies', xbmc.movies)
  app.get('/xbmc/movies/:id([0-9]+)', xbmc.movie)
  app.get('/xbmc/artists', xbmc.artists)
  app.get('/xbmc/artist', xbmc.artist)
  app.get('/xbmc/albums', xbmc.albums)
  app.get('/xbmc/album', xbmc.album)
  app.post('/xbmc/file', reqLogin(xbmc.playFile))
  app.get('/xbmc/playlists', xbmc.playlists)
  app.get('/xbmc/playlists/:listId(0|1)/:pos([0-9]+)', reqLogin(xbmc.playPlaylist))
  app.get('/xbmc/playlists/:listId(0|1)/insert/:id([0-9]+)/:pos([0-9]+)', reqLogin(xbmc.insert))
  app.get('/xbmc/playlists/:listId(0|1)/remove/:pos([0-9]+)', reqLogin(xbmc.remove))
  
  //API catch-all
  app.get('*', function(req, res){ res.status(401).json({ error:'Invalid API call' }) })
  app.post('*', function(req, res){ res.status(401).json({ error:'Invalid API call' }) })
}