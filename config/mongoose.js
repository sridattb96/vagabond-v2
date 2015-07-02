var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function() {
  	var db = mongoose.createConnection(config.db);

  	require('../app/models/place');
  	require('../app/models/user');

  	return db;
};

