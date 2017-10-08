/*
models/message.js
Message controller class to handle all methods interfacing with the message
database.
*/

var messageModel = require("../models/index").models.messages;

/*
Save the message object to the models
*/
exports.addMessage = function(message){
	var newMessage = new messageModel({message : message.content,
									user : message.username,
									date : message.date});
	newMessage.save(function(err){
	if(err){
		throw err;
	}

	});
}

/*
Retrieve the entire chat history and run a callback to emit an event
*/
exports.getMessages = function(otherInfo, callback){
	  messageModel.find({}, null, {sort: 'date'}, function(err, data){
		if(!err){
			callback(otherInfo, data);
		}
	});
}
