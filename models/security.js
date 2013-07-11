module.exports = function(sequelize, DataTypes) {
  return sequelize.define('security', {
    status: { type:DataTypes.ENUM, values:['off', 'day', 'night', 'vacation', 'day armed', 'disarming', 'arming'] },
  }, {
    freezeTableName: true,
    classMethods: {
      
      entries:function(res){
        this.all({ order:'createdAt DESC' }).success(function(entries){
          res.json({ latest:entries[0], history:entries });
        })
      },
    }
  });
};
