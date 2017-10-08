/*
routes/index.js
Binds functionality to any http requests that are generated on a certain URL.
*/
var express = require('express');
var router = express.Router();
var flash = require('req-flash');
var userController = require('../controllers/user');


/*
Define the home page for the project, send a get request on root to login
*/
router.get('/', function(req, res, next) {
  // some page variables are set depending on the context of the render
  res.render('login', { title: 'FSE chat', failedLogin : false,
										failedRegister : false,
										newRegister : false,
										showRegisterForm : false});
});

/*
A post on /login is called when the login form is submitted, the
data is sent to the user db controller for verification
*/
router.post('/login', userController.verifyUser);

/*
A post on /register is called when the register form is submitted,
the register request is sent to the user db controller to check if
the name is available and add to db if unique
*/
router.post('/register', userController.addUser);

/*
TODO
router.get('/chatRoom', function(req, res, next) {
	res.render('rooms', { rooms });
});*/

/*
Called when the logout button is pressed, takes the user back to the
login page
*/
router.get('/logout', function(req, res, next) {
  res.render('login', { title: 'FSE chat', failedLogin : false,
										failedRegister : false,
										newRegister : false,
										showRegisterForm : false});
});

// TODO: 
// router.post('/message', function(req, res, next){
// 	var message = req.body.message;
// 	var name = req.user;
// 	var date = new Date();
// 	io.sockets.emit("incomingMessage", {message: message, name : name, date : date});
// })


module.exports = router;
