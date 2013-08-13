module.exports = function(sequelize, DataTypes) {
  var dt = require('../../lib/datetime')
  
  return sequelize.define('temperature_archive', {
    fahrenheit: DataTypes.DECIMAL(3, 1),
    celcius: DataTypes.DECIMAL(2, 1)
  }, {
    freezeTableName: true,
    instanceMethods: {
      parse:function(){
        return { id:this.id, fahrenheit:this.fahrenheit, celcius:this.celcius, timestamp:dt.dateTimeFormat(this.createdAt) }
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
