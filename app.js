

var mongoose = require('./config/mongoose')(); // because of mongoose.js exporting the function
var app = require('./config/express')();



app.listen(8081); 
console.log("App listening on port 8081");
