var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');

app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

var Schema = mongoose.Schema; 

var PlaceSchema = new Schema({
	text : String 
})

var Place = mongoose.model('Place', PlaceSchema);

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

app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); 
});

app.listen(8081); 
console.log("App listening on port 8081");
