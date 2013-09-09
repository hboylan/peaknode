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
      if(a == undefined) return res.status(400).json(e);
      // db.appliance_archive.findAll({ where:{appId:a.id}, limit:50, order:'id DESC' }).success(function(archives){
        // archives.forEach(function(a){ hist.push(a.parse()) })
        // res.json({ name:a.name, unit:a.unit, level:a.level, on:a.on, active:a.active, archives:hist })
        res.json(a.parse())
      // })
    }).error(function(err){
      res.status(400).json(e)
    })
  }

  this.state = function(req, res) {
    var state = req.body.state
      , node  = req.body.node
    db.appliance.find(req.params.id).success(function(a){
      if(a == undefined) return res.status(400).json({ error:'Invalid zone' });
      //Update Audio Zone state
      if(node == 'left')
        req.params.id = a.left
      else if(node == 'right')
        req.params.id = a.right
      else if(node == 'power'){
        req.params.id = a.power
        vera.power(req, res)
      }
      else return res.status(400).json({ error:'Invalid nodeId' })
      if(state == 'on' || state == 'off') vera.state(req, res)
    })
  }
}
module.exports = function(d, v){ return new ApplianceAPI(d, v) }