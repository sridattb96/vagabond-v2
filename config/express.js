// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var config = require('./config'),
	express = require('express'),
	morgan = require('morgan'),
	// compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy;

// Define the Express configuration method
module.exports = function() {
	var app = express(); 
	// Create a new Express application instance
	

	// Use the 'NDOE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	// Use the 'body-parser' and 'method-override' middleware functions
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	// Configure the 'session' middleware
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	}));

	// Set the application view engine and 'views' folder
	app.set('views', './app/views');
	app.engine('html', require('ejs').renderFile);
	app.engine('ejs', require('ejs').renderFile);

	//---------passport facebook login
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});

	passport.use(new FacebookStrategy({
	    clientID: 886471691414676,
	    clientSecret: "4aeb8bae912f2de14a64e685f7ec59a0",
	    callbackURL: "http://localhost:8081/auth/facebook/callback",
	    enableProof: false
	  },
	  function(accessToken, refreshToken, profile, done) {
	    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
	    //   return done(err, user); //user record stored in database
	    // });
		console.log(profile);
		// console.log("access token = " + accessToken); 
		process.nextTick(function (){
			return done(null, profile);
		});
	  }
	));

	app.use(passport.initialize());
	app.use(passport.session());

	// Load the routing files
	require('../app/routes/routes.js')(app);

	// Configure static file serving
	app.use(express.static('./public'));

	// Return the Express application instance
	return app;
};