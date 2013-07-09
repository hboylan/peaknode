var device = require('../config/database').device;

exports.devices = function(req, res) {
  device.all().success(function(devices){
    res.json(devices);
  });
};

