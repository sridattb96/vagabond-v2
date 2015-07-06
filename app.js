var mongoose = require('./config/mongoose')(); // because of mongoose.js exporting the function
var app = require('./config/express')();

app.set('port', (process.env.PORT || 8081));

// -- SOCKET IO, REFACTOR LATER
var server = require('http').createServer(app).listen(app.get('port'), function() {
	console.log('App is running on port', app.get('port'));
});
var io = require('socket.io').listen(server);

io.on('connection', function(socket){
	console.log('a user connected');
});

