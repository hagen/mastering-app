// BASE SETUP
// =============================================================================
// DEBUG=*,-not_this
// call the packages we need
// Load up environment variables
var env = require('node-env-file');
env(__dirname + '/.env');

// Express
var express = require('express'); // call express
var app = express(); // define our app using express
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 80; // set our port
var mongoose = require('mongoose');
var session = require('express-session');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Serve up static app files; this is not required for mobile packaging
app.use(express.static('./src'));

// SDK is always hosted outside of the app directory, and incorporated with
// a virtual path for serving to the app
app.use('/sdk', express.static('../sdk'));

// =============================================================================
// Sockets from socket.io
// =============================================================================
io.on('connection', function(socket){
  console.log('a user connected');
});

// =============================================================================
// ROUTING
// =============================================================================
require('./app/routes')(app, io);

// =============================================================================
// START THE SERVER
// =============================================================================
http.listen(port, function(){
  console.log('Magic happens on port ' + port);
});
