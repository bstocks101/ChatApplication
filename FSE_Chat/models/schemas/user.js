/*
database/schemas/user.js
Schema design for the user table in the database
*/
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/*
Very simple user schema, could well be expanded
*/
var UserSchema = Schema(
  {
    userName: {type: String, required: true, min : 3 , max: 20},
    password: {type: String, required: true, min : 3, max: 20},
  }
);

//Export model
module.exports = mongoose.model('User', UserSchema);
