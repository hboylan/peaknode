module.exports = function(sequelize, DataTypes) {
  return sequelize.define('audio', {
    name: DataTypes.STRING,
    zone_id: { type:DataTypes.INTEGER, validate:{ min:1, max:8 }},
    active: { type:DataTypes.BOOLEAN, defaultValue:false },
    volume: { type:DataTypes.INTEGER, validate:{ min:0, max:100 }, defaultValue:0 },
  }, {
    freezeTableName: true,
    instanceMethods:{
      
      setState:function(client, res, state){
        client.send('audiocontrol '+this.zone_id+' '+state);
        this.active = (state)? true : false;
        this.save();
        res.json(this);
      },
      
      setVolume:function(client, res, vol){
        var mute    = vol == 0
          , msg     = mute? 'audiocontrol '+this.zone_id+' 3' : 'audiovolume '+this.zone_id+' '+vol;
  
        client.send(msg);
        this.active = true;
        this.volume = vol;
        this.save();
        res.json(this);
      },
      
    },
    
    classMethods:{
      //Helper functions
      checkZone:function(res, zone){
        if(zone < 1 || zone > 8 || zone == undefined) res.json({'error':'Audio Zone must be 1-8'});
      },
    }
  });
};
