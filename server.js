// The given vars are packages

// Creates an Express application
var express = require('express');
var app = express();
// Server listens at this port
var port = process.env.PORT || 8000;
// Morgan:- HTTP request logger middleware for node.js
var morgan = require('morgan');
// Handler for mongo database
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router(); // Define router 
var appRoutes = require('./app/routes/api')(router); // file for routes
var path = require('path');
var Inventory = require('./app/models/inventory');

// app.use allows you ti use all  of the middleware
// Middlewares have to be running before the rest of the code
// Order of middleware is important. Need to parse json before routing. 
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// serve static content for the app from the "public" directory; frontend has access to everything is public folder
app.use(express.static(__dirname + '/public')); //static file location of public for frontend files 
app.use('/api', appRoutes); // /api deconflicts the backend from frontend routes. 

// Open a connection to the tutorial database on our locally running instance of MongoDB
// TODO: Change the name before deploying to client
mongoose.connect('mongodb://localhost:27017/tutorial', function(err) {
	if(err){
		console.log('Not connected to the database: ' + err);
	} else {
		console.log('Successfully connected to MongoDB');
	}
});

// Route
// Send the user index.html file
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// Server port / starts
app.listen(port, function(){
	console.log('Running the server on port ' + port);
});