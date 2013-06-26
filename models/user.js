module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    username: DataTypes.STRING,
    realname: DataTypes.STRING,
    email: DataTypes.STRING
  });
};
