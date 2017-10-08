/*
socket/index.js
Defines all of the server side behaviour for socket events
*/

// some socket events require models queries using
// the message db controller
var MessageModel = require('../controllers/message');

// define as a function to become available when file is
// called by "require"
var ioEvents =  function(io){
	var participants = []; //empty array to be updated as users come and go

	/*
	Callback function to be passed to db controller. Emits a socket event
	and passes socket id of the new user, name of the new user,
	a list of all participants and a chat history (only used by new user)
	*/
	var emitNewConnection = function(data, chatHistory){
		var returnObj = {participants:data.participants, newID : data.id,
			newPerson : data.name, messages : chatHistory};
			io.sockets.emit("newConnection", returnObj);
		}
		io.on("connection", function(socket){

			/*
			When a new client connects they emit a "newUser" event, we must
			notify all other users of the new connection as well as send the
			new user the chat history to this point
			*/
			socket.on("newUser", function(data) {
				// add the new user to the participants list
				participants.push({name: data.name, id : data.id});
				data.participants = participants;
				// Ask the messages models for the chat history, pass the
				// emitNewConnection function as a callback
				var chatHistory = MessageModel.getMessages(data, emitNewConnection);
			});

			/*
			This disconnet event is automatically captured, we need to remove the
			user from the participants list and send the new list to all current
			users
			*/
			socket.on("disconnect", function(data) {
				// find the user that is leaving the chat to tell the other users
				for(var i = 0, m = null; i < participants.length; ++i) {
					if(participants[i].id != socket.id)
					continue;
					m = participants[i];
					break;
				}
				// remove the departing user from the participants list
				participants = participants.filter(function(el) {
					return el.id !== socket.id;
				});
				// trigger an event and deliver the new participants list as well
				// as the user object that is leaving
				io.sockets.emit("userDisconnected", {participants:participants, leaver:m});
			});

			/*
			When a new message is posted we must save the message to the db and
			notify other users of the new message.
			*/
			socket.on("newMessage", function(message){
				MessageModel.addMessage(message);
				io.sockets.emit("incomingMessage", message);
			})

		});
	}

	module.exports = ioEvents;
