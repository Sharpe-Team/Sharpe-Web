// Import lib
let path = require('path');
let fs = require('fs');
let express = require('express');
let https = require('https');
let socketIO = require('socket.io');
let socketIOFileUpload = require('socketio-file-upload');
let ExpressPeerServer = require('peer').ExpressPeerServer;
let initSocketIO = require('./sockets.js');

// Define CONSTANTS
const ROOT_PATH_VIEW = __dirname + '/public';
const UPLOAD_DIRECTORY = __dirname + '/public/uploads';

const serverOptions = {
	key: fs.readFileSync(__dirname + '/ssl/server.key'),
	cert: fs.readFileSync(__dirname + '/ssl/server.crt'),
	passphrase: "270195Boy77",
	requestCert: false,
	rejectUnauthorized: false
};

let app = express();
let server = https.createServer(serverOptions, app);
let io = socketIO.listen(server);

/**
 * Manage users's HTTP requests by sending them files from public directory
 */
app.use(express.static(ROOT_PATH_VIEW));

app.use(socketIOFileUpload.router);

app.use('/peerjs', ExpressPeerServer(server, {}));

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
});

// Compute clients connection with SocketIO
initSocketIO(io, socketIOFileUpload, UPLOAD_DIRECTORY);

// Create directory for uploads if it doesn't exist
fs.mkdir(UPLOAD_DIRECTORY, 777, function(err) {
	if (err && err.code !== 'EEXIST') {
		console.log("An error happened while creating the 'upload' directory...", err);
	}
});

/**
 * Start the HTTPS server listening incoming connections on port 3000
 */
server.listen(3443, function () {
	console.log('Server is listening on *:3443');
});
