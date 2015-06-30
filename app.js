var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	config = require('./config/config'),
	mongoose = require('./config/mongoose')(), // because of mongoose.js exporting the function
	morgan = require('morgan'),
	methodOverride = require('method-override'),
	// passport = require('./config/passport')(), // same as mongoose issue
	session = require('express-session'),
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy;

var currentUser; 

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

app.use(express.static(__dirname + '/public'));

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
	app.use(compress());
}

app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.use(session({
	saveUninitialized: true,
	resave: true,
	secret: config.sessionSecret
}))

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
	process.nextTick(function (){
		return done(null, profile);
	});
  }
));

app.use(passport.initialize());
app.use(passport.session());

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

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.user);
    currentUser = req.user; 

    res.redirect('/main.html');;
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/main', function(req, res) {
	
	res.send('./public/main.html');
})

app.get('/api/loginInfo', function(req, res) {
	console.log(req.user); 
	res.send(req.user);
})

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

app.listen(8081); 
console.log("App listening on port 8081");
