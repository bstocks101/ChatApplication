/*
app.js
Launching point of the program, handles all dependencies and middleware
*/
// add dependencies
var express   = require('express');
var app     = express();
var path    = require('path');
var bodyParser  = require('body-parser');
var flash     = require('connect-flash');
var routes    = require('./routes');
var http = require("http").Server(app)
var io 		= require('socket.io')(http);
var ioEvents = require('./socket/index');
var index = require('./routes/index');

// setup socket events
ioEvents(io);

// using EJS view engine, set views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// configure middleware and directories
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/', routes);
app.use(flash());
app.use("/public", express.static(__dirname + "/public"));

// start the http server
http.listen(3000, function(){
  console.log('listening on *:3000');
});
