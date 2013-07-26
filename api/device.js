var device = require('../lib/database').device;

exports.devices = function(req, res) {
  device.all().success(function(devices){
    res.json(devices);
  });
};

