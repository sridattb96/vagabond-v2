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
	    // res.sendfile('./public/login.html'); 
	    res.render('login.html')
	});

	app.get('/auth/facebook',
	  passport.authenticate('facebook', { scope: ['user_likes', 'user_friends'] }), function(req, res){

	  });

	var User = mongoose.model('User');

	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/login'}),
	  function(req, res) { 

	  

	    // Successful authentication, redirect home.
	    User.findOne({ facebookId : req.user.id }, function (err, user) {
	    	if (err) {
	    		return next(err); 	
	    	}
	    	else {
	    		if (! user) {
	    			console.log('NEW USER NOT FOUND IN DB, ADDING HIM / HER');
	    			var newUser = new User({
	    				facebookId : req.user.id,
	    				firstName : req.user._json["first_name"],
	    				lastName : req.user._json["last_name"],
	    				age: 10,
	    				gender : req.user.gender,
	    				city: "",
	    				state: "",
	    				biography: "",
	    				interests: ""
	    			});
	    			newUser.save(function(err) {
	    				if (err) {
	    					console.log('ERROR SAVING NEW USER');
	    				}
	    			})

	    		}
	    	}
	    })
	    // User.create({ 
	    // 	facebookId : req.user.id
	    // }, function(err, user) {
	    // 	// 
	    // });
		res.redirect('/main');
	  });
	  

	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});

	app.get('/main', function(req, res) {
		res.render('main.ejs', {
			picture: 'https://graph.facebook.com/' + req.user.id + '/picture?height=350&width=250'
		});
		
		// res.send('./public/main.html');
	})

	app.get('/api/loginInfo', function(req, res) {
		res.send(req.user); 
	});

	app.get('/api/users', function(req, res) {	
		User.find({}, function(err, users) {
			if (err) {
				res.send(err);
			}
			res.json(users);
		});
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

	//user profile information

	app.get('/profile', function(req, res){
		res.render('profile.html');
	});

	// app.put('/api/saveInfo/:id', function(req, res){
	// 	console.log('req.body')
	// 	User.findOne({ facebookId: req.params.id}, function(err, data){
	// 		if (err) {
	// 			console.log(err)
	// 		} else {
	// 			if (data == null){
	// 				console.log('you dont exist')
	// 			} else {
	// 				User.update({ facebookId: req.params.id}, { 
	// 					$set: {
	// 						"age" : req.body.age,
	// 						"gender" : req.body.gender,
	// 						"city" : req.body.city,
	// 						"state" : req.body.state,
	// 						"biography" : req.body.biography,
	// 						"interests" : req.body.interests
	// 					} 
	// 				}, {upsert: false}, function(err, data){
	// 					console.log(data);
	// 				})
	// 			}
	// 		}
	// 	})
	// })
	
	app.put('/api/saveInfo/:id', function(req, res){
		console.log('req.body')
		User.findOne({ facebookId: req.params.id}, function(err, user){
			if (err)
				console.log(err);
			else {
				if (! user) {
					console.log('you dont exist');
				}
				else {
					user.age = req.body.age;
					user.gender = req.body.gender;
					user.city = req.body.city;
					user.state = req.body.state;
					user.biography = req.body.biography;
					user.interests = req.body.interests;

					user.save();
				}
			}
			console.log(user);
		});
	});

	// app.put('/api/saveInfo/:id', function(req, res){
	// 	console.log('req.body')
	// 	User.findOneAndUpdate({ facebookId: req.params.id}, {
	// 		$set: {
	// 			age : req.body.age,
	// 			gender : req.body.gender,
	// 			city : req.body.city,
	// 			state : req.body.state,
	// 			biography : req.body.biography,
	// 			interests : req.body.interests
	// 		} 
	// 	}, {upsert: false}, function(err, data){
	// 		console.log(data);
	// 	});
	// });
};