/**
##############################################################################################
## ------------------------------
## KangarooRideBookingApp
## ------------------------------
## 
##  File 	: server.js
##  
##  Purpose : Configuration file for the NodeJS Server
##
##  Author  : Ghanshhyam Malu
##            gmalu@indiana.edu
##
##  Created : Oct 23, 2015
##
##  Modified : 
##  
##############################################################################################
*/
// set up ======================================================================
var express = require('express');
var app = express();

// Don't crash when an error occurs, instead log it
process.on('uncaughtException', function(err) {
    console.log(err);
});


var mongoose = require('mongoose'); // mongoose for mongodb
var flash = require('connect-flash');

var port = process.env.PORT || 8080; // set the port
var morgan = require('morgan'); // log requests to the console (express4)
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cookieParser = require('cookie-parser');
var database = require('./app/config/database'); // load the database config
var cors = require("cors");
var favicon = require('serve-favicon');
var path = require('path');


// configuration ===============================================================
mongoose.connect(database.url); // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(cors());
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
// app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());

app.set('trust proxy', 'loopback') // specify a single subnet

app.use(flash()); // use connect-flash for flash messages stored in session

// Set favicon
app.use(favicon(path.join(__dirname,'public','img','favicon.ico')));

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("KangarooRideBookingApp Server App listening on port " + port);

module.exports = app;
