module.exports = function(sequelize, DataTypes) {
  return sequelize.define('light', {
    name: DataTypes.STRING,
    unit: { type:DataTypes.INTEGER, validate:{ min:1, max:511 } },
    level: { type:DataTypes.INTEGER, validate:{ min:0, max:100 }, defaultValue:0 },
    state: { type:DataTypes.ENUM, values:['on', 'off', 'dimming', 'brightening'], defaultValue:'off' },
  }, {
    instanceMethods:{
      
      parse:function(){
        this.updatedAt = this.createdAt = undefined;
        return this;
      },
      
      setState:function(client, state){
        client.send('setlight '+this.unit+' '+state);
        this.state = state;
      },
      
      setLevel:function(client, level){
        client.send('setlight '+this.unit+' '+level);
        this.level = parseInt(level, 10);
      },
      
      step:function(client, action, level, time){
        client.send('set'+action+' '+this.unit+' '+level+' '+time);
        this.timeout(time);
        this.level = parseInt(level, 10);
        this.state = (action == 'dim')? 'dimming':'brightening';
      },
      
      timeout:function(time){
        var light = this, c = this.createdAt, u = this.updatedAt;
        setTimeout(function(){
          var action = light.state;
          light.createdAt = c;
          light.updatedAt = u;
          light.updateAttributes({ state:(light.level == 0)? 'off':'on' })
            .success(function(light){ console.log('Finished '+action+': '+light.name)})
        }, time * 1000)
      },
      
    },
    
    classMethods:{
      
      parse:function(lights){
        if(lights == undefined) lights = [];
        else lights.forEach(function(l){ l = l.parse(); })
        return lights;
      },
      
      list:function(success){
        this.all({ order:'unit ASC' }).success(success);
      },
      
      update:function(id, res, success){
        this.find(id).success(function(light){
          if(light == undefined) res.json({ error:'Invalid light' })
          success(light);
          res.json(light.parse())
        })
      },
    }
  });
};
