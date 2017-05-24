// The given vars are packages

var express = require('express'); // ExperssJS Framework
var app = express();// Invoke express to variable for use in application
var port = process.env.PORT || 8000; // Set default port or assign a port in environment
var morgan = require('morgan');// Morgan:- HTTP request logger middleware for node.js
var mongoose = require('mongoose');// Handler for mongo database
var bodyParser = require('body-parser');// Node.js body parsing middleware. Parses incoming request bodies in a middleware before your handlers, available under req.body.
var router = express.Router(); // Invoke the express router 
var appRoutes = require('./app/routes/api')(router); // file for routes
var path = require('path');// Import path module
var Inventory = require('./app/models/inventory'); // Import inventory.js 




// app.use allows you ti use all  of the middleware
// Middlewares have to be running before the rest of the code
// Order of middleware is important. Need to parse json before routing. 
app.use(morgan('dev'));  // Morgan Middleware
app.use(bodyParser.json()); // Body-parser middleware
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

// Set the graph layouts
app.get('/graph1', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/graphs/bargraph.html'));
});
app.get('/graph2', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/graphs/DatevsTotalCheckins.html'));
});
app.get('/graph3', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/graphs/DatevsTotalCheckouts.html'));
});

// Route
// Send the user index.html file
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// Start server
app.listen(port, function(){
	console.log('Running the server on port ' + port);
});