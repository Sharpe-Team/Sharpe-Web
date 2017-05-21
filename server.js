// Import lib
var path = require('path');
var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var socketIOFileUpload = require('socketio-file-upload');
var ExpressPeerServer = require('peer').ExpressPeerServer;

var initSocketIO = require('./sockets.js');

// Define CONSTANTS
var ROOT_PATH_VIEW = __dirname + '/public';
const UPLOAD_DIRECTORY = __dirname + '/public/uploads';

/**
 * Manage users's HTTP requests by sending them files from public directory
 */
app.use(express.static(ROOT_PATH_VIEW));

app.use(socketIOFileUpload.router);

app.use('/peerjs', ExpressPeerServer(http, {}));

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
});

// Compute clients connection with SocketIO
initSocketIO(io, socketIOFileUpload, UPLOAD_DIRECTORY);

// Create directory for uploads if it doesn't exist
fs.mkdir(UPLOAD_DIRECTORY, 777, function(err) {
	if (err && err.code != 'EEXIST') {
		console.log("An error happened while creating the 'upload' directory...", err);
	}
});

/**
 * Start the server listening incoming connections on port 3000
 */
http.listen(3000, function () {
	console.log('Server is listening on *:3000');
});
