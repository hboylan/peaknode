module.exports = function(sequelize, DataTypes) {
  return sequelize.define('audio', {
    name: DataTypes.STRING,
    source: { type:DataTypes.INTEGER, validate:{ min:1, max:8 }, defaultValue:1 },
    state: { type:DataTypes.ENUM, values:['on', 'off', 'mute'], defaultValue:'off' },
    volume: { type:DataTypes.INTEGER, validate:{ min:0, max:100 }, defaultValue:0 },
  }, {
    freezeTableName: true,
    instanceMethods:{
      
      parse:function(){
        this.createdAt = this.updatedAt = undefined;
        return this;
      },
      
      setState:function(state){
        this.tellOmni('control', ['off', 'on', 'unmute', 'mute'].indexOf(state))
        this.state = state;
      },
      
      setVolume:function(vol){
        this.tellOmni('volume', vol)
        this.state = 'on';
        this.volume = parseInt(vol, 10);
      },
      
      setSource:function(source){
        this.tellOmni('source', source)
        this.source = parseInt(source, 10);
      },
      
      tellOmni:function(cmd, data){
        require('../app').get('omnilink-client').command('audio.'+cmd, [this.id, data])
      }
    },
    classMethods:{
      
      parse:function(audioZones){
        if(audioZones == undefined) audioZones = [];
        else audioZones.forEach(function(a){ a = a.parse(); })
        return audioZones;
      }
    }
  });
};
