// Invoke 'strict' JavaScript mode
'use strict';

var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	mongoose = require('../../config/mongoose')();

// Define the routes module' method
module.exports = function(app) {
	app.get('*', function(req, res, next) {
		next();
		// if (! req.user) {
		// 	console.log('NO USER BREH');
		// 	next();
		// }
		// console.log('FOUND USER BREH');
		// next();
	})

	app.get('/test', function(req, res) {
		res.render('test.html');
	})


	app.get('/', function(req, res) {
		if (req.user) {
			res.render('main.html');
		}
		else {
			res.render('login.html')
		}
		// if (req.session.lastVisit) {
	 //    	console.log(req.session.lastVisit);
	 //    }
	 //    req.session.lastVisit = new Date(); 

	    
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
	    				occuption: "Traveler",
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
		res.redirect('/main');
	  });
	  

	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});

	app.get('/main', function(req, res) {
		if (req.user) {
			res.render('main.html');
		}
		else {
			res.render('login.html')
		}
	});

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
			name : req.body.name, 
			reason : req.body.reason,
			requester : {
				name : req.user.displayName,
				facebookId : req.user.id
			},
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

	app.get('/profile-edit', function(req, res){
		res.render('profile-edit.html');
	});

	app.get('/profile', function(req, res){
		res.render('profile.html', { 
			// picture: 'https://graph.facebook.com/' + req.user.id + '/picture?height=100&width=100'
		});
	});
	
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
					user.email = req.body.email;
					user.age = req.body.age;
					user.occupation = req.body.occupation;
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

	app.get('/api/getSavedInfo/:id', function(req, res){
		User.findOne({facebookId: req.params.id}, function(err, user){
			if (err)
				console.log(err);
			else {
				if (!user){
					console.log('you dont exist')
				} else {
					res.send(user);
				}
			}
		})
	})

	//find users that match desired locations
	/*
	app.get('/api/createFeed/:id', function(req, res){
		User.findOne({facebookId: req.params.id}, function(err, user){
			if (err)
				console.log(err)
			else {
				if (!user)
					console.log('you dont exist')
				else {
					//loop through every element of user's place list and every other person's placelist??
					//something more efficient
				}
			}
		})
	})
	*/
};