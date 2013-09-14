function ApplianceAPI(db, vera)
{
  this.list = function(req, res) {
    db.zone.all({ order:'id ASC', include:[db.appliance] }).success(function(zones){
      var apps = []
      zones.forEach(function(z){
        apps.push({
          id:z.id,
          name:z.name,
          appliances:(z.appliance == undefined)? [] : db.appliance.parse(z.appliance)
        })
      })
      res.json(apps)
    })
  }

  this.show = function(req, res) {
    var e = { error:'Invalid appliance' }, hist = [];
    db.appliance.find(req.params.id).success(function(a){
      if(a == undefined) return res.status(401).json(e);
      // db.appliance_archive.findAll({ where:{appId:a.id}, limit:50, order:'id DESC' }).success(function(archives){
        // archives.forEach(function(a){ hist.push(a.parse()) })
        // res.json({ name:a.name, unit:a.unit, level:a.level, on:a.on, active:a.active, archives:hist })
        res.json(a.parse())
      // })
    }).error(function(err){
      res.status(401).json(e)
    })
  }

  this.switch = function(req, res) {
    var state = req.body.state
      , node  = req.body.node
    db.appliance.find(req.params.id).success(function(a){
      if(a == undefined) return res.status(401).json({ error:'Invalid zone' });
      //Update Audio Zone state
      if(node == 'left')
        req.params.id = a.left
      else if(node == 'right')
        req.params.id = a.right
      else return res.status(401).json({ error:'Invalid nodeId' })
      
      //Switch node
      if(state == 'on' || state == 'off'){
        if(node == 'left')        a.leftOn  = state == 'on'? true:false
        else if(node == 'right')  a.rightOn = state == 'on'? true:false
        a.save()
        req.body.type = 'switch'
        vera.state(req, res)
      }else res.status(401)
    })
  }
}
module.exports = function(d, v){ return new ApplianceAPI(d, v) }