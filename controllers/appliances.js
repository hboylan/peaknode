function ApplianceAPI(db, vera)
{
  this.list = function(req, res) {
    db.appliance.all({ order:'id ASC' }).success(function(apps){
      res.json(db.appliance.parse(apps))
    })
  }

  this.switch = function(req, res) {
    var state = req.body.state
      , node  = req.body.node
    db.appliance.find(req.params.id).success(function(a){
      if(a == undefined) return res.status(401).json({ error:'Invalid zone' });
      //Update Audio Zone state
      if(node == 'left')        req.params.id = a.left
      else if(node == 'right')  req.params.id = a.right
      else return res.status(401).json({ error:'Invalid nodeId' })
      
      //Switch node
      if(state == 'on' || state == 'off'){
        if(node == 'left')        a.leftOn  = state == 'on'? true:false
        else if(node == 'right')  a.rightOn = state == 'on'? true:false
        a.save()
        req.body.type = 'switch'
        vera.state(req, res)
      }else res.status(401).json({ error:'Invalid state' })
    })
  }
}
module.exports = function(d, v){ return new ApplianceAPI(d, v) }