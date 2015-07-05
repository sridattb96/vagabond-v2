var mongoose = require('./config/mongoose')(); // because of mongoose.js exporting the function
var app = require('./config/express')();

// -- SOCKET IO, REFACTOR LATER
var server = require('http').createServer(app).listen(8081);
var io = require('socket.io').listen(server);

io.on('connection', function(socket){
console.log('a user connected');
});

// app.listen(8081); 
console.log("App listening on port 8081");
