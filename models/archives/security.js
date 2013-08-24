module.exports = function(sequelize, DataTypes) {
  var dt = require('../../lib/datetime')
  
  return sequelize.define('security_archive', {
    armed: DataTypes.BOOLEAN
  }, {
    freezeTableName: true,
    instanceMethods: {
      parse:function(){
        return { id:this.id, armed:this.armed, timestamp:dt.dateTimeFormat(this.createdAt) };
      },
    },
    classMethods: {
      
      entries:function(res){
        this.all({ order:'createdAt DESC' }).success(function(entries){
          entries.forEach(function(e){ e = e.parse() })
          res.json({ latest:entries[0], history:entries })
        })
      },
    }
  });
};
