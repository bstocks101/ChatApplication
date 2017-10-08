/*
models/user.js
User controller class to handle all methods interfacing with the user
database.
*/

var userModel = require("../models/index").models.user;

/*
Checks to see if a valid username and password pair has been used for login
*/
exports.verifyUser = function(req, res){
	// grabs the name and password from the form
	var name = req.body.username;
	var pass = req.body.password;
	// queries the user models for an occurence of the username AND password
	userModel.find({
		$and:[
			{userName : name},
			{password : pass}
		]}, function(err, doc){
			// looks for any results (can only ever be one or none)
			if(doc.length){
				// if the pair exists, the user is allowed entry to the chatroom
				res.render("chatroom", {user : name});
			}
			else{
				// else the user is sent back to the login page with a failure message
				res.render("login", {Title : 'FSE Chatroom', failedLogin : true,
				failedRegister : false,
				newRegister : false,
				showRegisterForm : false});

			}
		});
	};

	/*
	Checks to see if the username has already been used and adds the user if
	the name is unique
	*/
	exports.addUser = function(req, res){
		var name = req.body.username;
		var pass = req.body.password;
		var newUser = new userModel({
			userName : name,
			password : pass
		});
		// runs a query on just the name
		userModel.find(
			{userName : name}
			, function(err, doc){
				// if any results, then we know the name exists
				if(doc.length){
					// send the user back to the register page
					// with a registration error message
					res.render("login", {Title : 'FSE Chatroom', failedLogin : false,
					failedRegister : true,
					newRegister : false,
					showRegisterForm : true});
				}
				else{
					// else save the new username and password
					newUser.save(function(err){
						if(err){
							return;
						}
						else{
							// send the user back to login with success message
							res.render("login", {Title : 'FSE Chatroom', failedLogin : false,
							failedRegister : false,
							newRegister : true,
							showRegisterForm : false});
						}
					});
				}
			});
		}
