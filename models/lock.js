module.exports = function(sequelize, DataTypes) {
  return sequelize.define('lock', {
    locked: { type:DataTypes.BOOLEAN, defaultValue:false },
  }, {
    instanceMethods:{
      parse:function(){
        this.updatedAt = this.createdAt = undefined;
        return this;
      },
    },
  });
};
