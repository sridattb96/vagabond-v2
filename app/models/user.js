var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var UserSchema = new Schema({
	firstName : String,
	lastName : String,
	age : Number,
	gender : String,
	city: String,
	state : String,
	biography: String,
	interests: String,
})

var User = mongoose.model('User', UserSchema);