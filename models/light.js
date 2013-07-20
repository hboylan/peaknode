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
        client.send('setlight '+this.id+' '+state);
        this.state = state;
      },
      
      setLevel:function(client, level){
        client.send('setlight '+this.id+' '+level);
        this.level = parseInt(level, 10);
      },
      
    },
    
    classMethods:{
      
      parse:function(lights){
        lights.forEach(function(l){ l = l.parse(); })
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
