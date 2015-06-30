var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var PlaceSchema = new Schema({
	text : String 
})

var Place = mongoose.model('Place', PlaceSchema);