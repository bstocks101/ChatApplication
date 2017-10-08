/*
database/index.js
The file responsible for the connection to the database as well as the
supply of the models for the tables in the database
*/
var Mongoose 	= require('mongoose');

// Connect to the models (hosted on mLab)
var dbURI = "mongodb://admin:admin@ds161913.mlab.com:61913/fse_chat"
Mongoose.connect(dbURI);

// Check the connection
Mongoose.connection.on('error', function(err) {
	if(err) throw err;
});

// Use native promises
Mongoose.Promise = global.Promise;

// make the connection and the data controllers available
module.exports = { Mongoose,
	models: {
		user: require('./schemas/user.js'),
		messages: require('./schemas/message.js')}
};
