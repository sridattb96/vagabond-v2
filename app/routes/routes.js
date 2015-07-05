// Invoke 'strict' JavaScript mode
'use strict';

var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	mongoose = require('../../config/mongoose')(),
	https = require('https');

var Place = mongoose.model('Place'),
	User = mongoose.model('User');


// Define the routes module' method
module.exports = function(app) {

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
	  	User.findOne({ 'fb.id': profile.id }, function (err, user) {
	  		if (err) {
	  			return next(err); 	
	  		}
	  		else {
	  			if (! user) {
	  				var newUser = new User({
	  					fb : profile,
	  					accessToken : accessToken
	  				});
	  				
	  				newUser.save(function(err) {
	  					if (err) {
	  						console.log('ERROR SAVING NEW USER');
	  					}
	  				})

	  			}
	  		}
	  	})
		
		process.nextTick(function (){
			return done(null, profile);
		});
	  }
	));

	app.use(passport.initialize());
	app.use(passport.session());


	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/login'}),
	  function(req, res) { 
		res.redirect('/main');
	  });
	  

	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});

	app.get('*', function(req, res, next) {
		next();
		// if (! req.user) {
		// 	console.log('NO USER BREH');
		// 	next();
		// }
		// console.log('FOUND USER BREH');
		// next();
	})

	app.get('/socket', function(req, res) {
		res.render('socket.html');
	})


	app.get('/', function(req, res) {
		console.log('HI HERE U GO');
		console.log(req.user);
		if (req.user) {
			res.render('main.html');
		}
		else {
			console.log("NO REQ USER BRUH");
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

	

	app.get('/main', function(req, res) {
		if (req.user) {
			res.render('main.html');
		}
		else {
			res.render('login.html')
		}
	});

	app.get('/api/loginInfo', function(req, res) {
		console.log(req.user);
		User.findOne({ 'fb.id' : req.user.id }, function(err, user) {
			if (err)
				next(err);
			else {
				if (! user) {
					res.send('User not found!');
				}
				else {
					res.json(user);
				}
			}

		})
		// res.send(req.user); 
	});

	app.get('/api/users', function(req, res) {	
		User.find({}, function(err, users) {
			if (err) {
				res.send(err);
			}
			res.json(users);
		});
	});

	app.get('/api/places', function(req, res) {
		Place.find(function(err, places) {
			if (err) {
				res.send(err);
			}
			res.json(places);
		})
	});

	app.post('/api/places', function(req, res) {
		var d = new Date(); 
		Place.create({
			name : req.body.name, 
			reason : req.body.reason,
			requester : {
				name : req.user.displayName,
				facebookId : req.user.id
			},
			time : d
		}, function(err, place) {
			
			if (err) {
				res.send(err);
			}
			User.findOne({ 'fb.id' : req.user.id }, function(err, user) {
				console.log(place._id); 
				user.placesOfInterest.push(place._id);
				user.save();
			})
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
	});

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
		User.findOne({ 'fb.id': req.params.id}, function(err, user){
			if (err)
				console.log(err);
			else {
				if (! user) {
					console.log('you dont exist');
				}
				else {
					user.fb.email = req.body.email;
					user.age = req.body.age;
					user.occupation = req.body.occupation;
					user.fb.gender = req.body.gender;
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

	app.get('/api/user/:id', function(req, res){
		User.findOne({ 'fb.id' : req.params.id}, function(err, user){
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