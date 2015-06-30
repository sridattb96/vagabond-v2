// Invoke 'strict' JavaScript mode
'use strict';

var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	mongoose = require('../../config/mongoose')();

// Define the routes module' method
module.exports = function(app) {
	// Load the 'index' controller
	// var index = require('../controllers/index.server.controller');

	// Mount the 'index' controller's 'render' method
	// app.get('/', index.render);

	app.get('/', function(req, res) {
		// if (req.session.lastVisit) {
	 //    	console.log(req.session.lastVisit);
	 //    }
	 //    req.session.lastVisit = new Date(); 
	    res.sendfile('./public/login.html'); 
	});

	app.get('/auth/facebook',
	  passport.authenticate('facebook'), function(req, res){

	  });

	var User = mongoose.model('User');

	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/login' }),
	  function(req, res) { 

	  

	    // Successful authentication, redirect home.
	    // User.create({ 
	    // 	facebookId : req.user.id
	    // }, function(err, user) {
	    // 	// 
	    // });

	    res.redirect('/main.html');
	  });
	  

	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});

	app.get('/main', function(req, res) {
		
		res.send('./public/main.html');
	})

	app.get('/api/loginInfo', function(req, res) {
		// User.find(function (err, users) {
		// 	if (err) {
		// 		res.send(err);
		// 	}
		// 	res.json(users);
		// });
		res.send(req.user); 
	});

	//-----------

	var Place = mongoose.model('Place');

	app.get('/api/places', function(req, res) {
		Place.find(function(err, places) {
			if (err) {
				res.send(err);
			}
			res.json(places);
		})
	})

	app.post('/api/places', function(req, res) {
		Place.create({
			text : req.body.text, 
			done : false
		}, function(err, place) {
			if (err) {
				res.send(err);
			}
			Place.find(function(err, places) {
				if (err) 
					res.send(err)
				res.json(places); 
			})
		})
	});

	app.delete('/api/places/:place_id', function(req,res){
		Place.remove({
			_id : req.params.place_id
		}, function(err, place) {
			if (err) {
				res.send(err);
			}
			Place.find(function(err, places) {
				if (err) {
					res.send(err);
				}
				res.json(places);
			})
		})
	})
};