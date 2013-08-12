function dateFormat(date){
  return date.getFullYear() + '-' + (date.getMonth()+1) + '-'  + date.getDate()
}
function dateMinutes(date){
  return (date.getHours() * 60) + date.getMinutes()
}

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('light_archive', {
    level: DataTypes.INTEGER,
  }, {
    freezeTableName: true,
    instanceMethods: {
      parse:function(){
        return { level:this.level, date:dateFormat(this.createdAt), minute:dateMinutes(this.createdAt) }
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
