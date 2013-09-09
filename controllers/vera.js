function VeraAPI(db)
{
  var http = require('http')
  
  function queryStr(params){
    var str = []
    for(p in params) str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]))
    return str.join("&")
  }
  function reqVera(params, res, callback){
    var url = 'http://192.168.1.111:3480/data_request?'+queryStr(params)
    console.log('VERA -> ', url)
    http.get(url, function(vera) {
      vera.setEncoding('utf8')
      vera.on('data', function(data){
        try{ callback(JSON.parse(''+data+'')) }catch(SyntaxError){ res.status(201).json({ error:'Target failed to respond', data:data }) }
      })
    }).on('error', function(e) {
      res.status(201).json({ error:e.message })
    })
  }
  
  this.available = function(req, res){
    reqVera({}, res, function(data){
      console.log(data)
      res.json(data)
    })
  }
  
  this.request = function(req, res){
    reqVera(req.query, res, function(data){
      res.send(data)
    })
  }
  
  this.list = function(req, res) {
    reqVera({ id:'sdata' }, res, function(data){
      res.json(data.devices)
    })
  }
  
  this.show = function(req, res){
    reqVera({ id:'status', DeviceNum:req.params.id }, res, function(data){
      res.json(data)
    })
  }
  
  this.state = function(req, res){
    var state = req.body.state
    if(state == 'on' || state == 'off')
      reqVera({
        id:'action',
        DeviceNum:req.params.id,
        serviceId:'urn:upnp-org:serviceId:SwitchPower1',
        action:'SetTarget',
        newTargetValue:state == 'on'? 1:0
      }, res, function(data){
        res.json(data)
      })
    else res.status(400).json({ error:'Invalid state' })
  }
  
  this.power = function(req, res){
    reqVera({
      id:'variableget',
      DeviceNum:req.params.id,
      serviceId:'urn:micasaverde-com:serviceId:EnergyMetering1',
      Variable:'Watts'
    })
  }
}
module.exports = function(d){ return new VeraAPI(d) }