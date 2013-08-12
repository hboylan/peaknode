function dateFormat(date){
  return date.getFullYear() + '-' + (date.getMonth()+1) + '-'  + date.getDate()
}
function dateMinutes(date){
  return (date.getHours() * 60) + date.getMinutes()
}

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('energy_archive', {
    power: DataTypes.DECIMAL(3, 2),
  }, {
    freezeTableName: true,
    instanceMethods: {
      parse:function(){
        return { id:this.id, power:this.power, timestamp:this.createdAt };
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
