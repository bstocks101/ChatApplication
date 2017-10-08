/*
database/schemas/message.js
Schema design for the message table in the database
*/
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/*
Ideally we would like the user to be a reference to the other table rather
than a string, this would make the messages searchable, display all messages
by a particular user etc. beyond the scope of this project
*/
var MessageSchema = Schema(
  {
    message: {type: String, required: true, min : 3 , max: 20},
    user: {type: String, ref: 'User', required: true},
    date: {type: Date, required: true}
  }
);

//Export model
module.exports = mongoose.model('Message', MessageSchema);
