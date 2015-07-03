var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var UserSchema = new Schema({
	facebookId : Number, 
	firstName : String,
	lastName : String,
	// occupation: String, 
	email : String,
	age : Number,
	gender : String,
	city: String,
	state : String,
	biography: String,
	interests: String,
	placesOfInterest: Array
});

var User = mongoose.model('User', UserSchema);