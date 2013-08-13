module.exports = function(sequelize, DataTypes, time) {
  var dt = require('../../lib/datetime')
  
  return sequelize.define('light_archive', {
    level: DataTypes.INTEGER,
  }, {
    freezeTableName: true,
    instanceMethods: {
      parse:function(){
        return { level:this.level, timestamp:dt.dateTimeFormat(this.createdAt) }
      },
      graphParse:function(){
        return { level:this.level, date:dt.dateFormat(this.createdAt), mins:dt.dateMinutes(this.createdAt) }
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
  })
}
