var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var UserSchema = new Schema({
	fb : Object, 
	accessToken : String, 

	occupation: {
		type: String, 
		default: "Traveler"
	},
	age: Number,
	city: String,
	state: String,
	biography: {
		type: String,
		default: "I like to travel!" 
	},
	interests: Array,
	placesOfInterest: Array
}, { 
	minimize: false
});

var User = mongoose.model('User', UserSchema);