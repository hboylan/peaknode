var spawn   = require('child_process').spawn
var express = require('express')
var app     = express()

app.use(express.static(__dirname))

app.get('/', function(req, res) {
  if(req.query.username != 'peakadmin' && req.query.password != 'bluemoon123') return res.status(401).json({ error:'Invalid auth' })
  var command = spawn(__dirname + '/server', [ req.query.command || '' ])
  var output  = []

  command.stdout.on('data', function(chunk) {
    output.push(chunk)
  })

  command.on('close', function(code) {
    if (code === 0)
      res.send(Buffer.concat(output))
    else
      res.send(401) // when the script fails, generate a Server Error HTTP response
  })
})

app.listen(8001)