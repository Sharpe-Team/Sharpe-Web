// Import lib
var nJwt = require('njwt');
var io;
var socketIOFileUpload;

// CONSTANTS
const SECRET_KEY = "ThisIsASecret";
const ALGORITHM = 'HS512';
var UPLOAD_DIRECTORY;

var connectedUsersMap = new Map();

/**
 * 	Check if the user is in the list
 */
function isPresent(list, user) {
	for (let i = 0; i < list.length; i++) {
		if(list[i].id == user.id) {
			return true;
		}
	}

	return false;
}

/**
 *	Verify the validity of the token.
 *	Return the decoded token if it is valid, return null otherwise.
 */
function getDecodedToken(token) {
	try {
		return nJwt.verify(token, SECRET_KEY, ALGORITHM);
	} catch(e) {
		console.log(e);
		return null;
	}
}

function getUserSockets(userId) {
	let sockets = [];

	for(var [key, value] of connectedUsersMap) {
		if(value.user.id == userId) {
			sockets.push(value.socket);
		}
	}

	return sockets;
}

function computeFileUpload(socket) {

	// Make an instance of SocketIOFileUpload and listen on this socket:
    var uploader = new socketIOFileUpload();
    uploader.dir = UPLOAD_DIRECTORY;
    uploader.listen(socket);

	// Do something when a file is saved:
    uploader.on("saved", function(event) {
        console.log("File uploaded !");
    });

    // Error handler:
    uploader.on("error", function(event) {
        console.log("Error from uploader", event);
    });
}

function onLogin(socket, token, loggedUser, callback) {
	var decodedToken;

	if(token && (decodedToken = getDecodedToken(token))) {
		if(connectedUsersMap.has(token)) {
			// The current socket is the new socket of a previous connected user
			// Assign to this new socket the previous data of the user
			loggedUser = connectedUsersMap.get(token);
			loggedUser.socket = socket;
			loggedUser.disconnected = false;
		} else {
			// Add a new user in the list of connected users
	    	loggedUser = {
				token: token,
				user: decodedToken.body.user,
				disconnected: false,
				socket: socket
			};
			connectedUsersMap.set(token, loggedUser);
			
    		// Send info user to all clients except current client
    		socket.broadcast.emit('new-connected-user', loggedUser.user);
		}

		// Send info user to client
		if(callback) {
			callback(loggedUser.user);
		}
	} else {
		console.log("Unregistered user connected...");
	}

	return loggedUser;
}

function onDisconnect(socket, loggedUser) {
	loggedUser.disconnected = true;

	// The user gets 10 seconds to reconnect
	setTimeout(function() {
		if(loggedUser.disconnected && loggedUser.user) {
    		onLogout(socket, loggedUser);
		}
	}, 10000);
}

function onVerifyToken(socket, token, callback) {
	var decodedToken = getDecodedToken(token);
	callback((decodedToken) ? decodedToken.body.user : null);
}

function onGetConnectedUsers(socket, callback) {
	var listUsers = new Array();
	for(var [key, value] of connectedUsersMap) {
		if(!isPresent(listUsers, value.user)) {
			listUsers.push(value.user);
		}
	}

	callback(listUsers);
}

function onLogout(socket, loggedUser) {
	socket.broadcast.emit('disconnected-user', loggedUser.user);
	connectedUsersMap.delete(loggedUser.token);
}

function onNewPrivatePoint(socket, point, userId) {

	// Get the socket for the user id, if the user is connected
	var userSockets = getUserSockets(userId);
	if(userSockets.length > 0) {
		for(let i=0; i<userSockets.length; i++) {
			userSockets[i].emit('new-private-point', point);
		}

		// If the sender and the receiver are not the same user, send the message to the sender
		if(!userSockets.includes(socket)) {
			socket.emit('new-private-point', point);
		}
	}
}

function computeConnection(socket) {
	/**
	 * Logged user of the socket
	 */
	var loggedUser = {
		token: null,
		user: null,
		disconnected: false,
		socket: socket
	};

	computeFileUpload(socket);

    socket.on('login', function(token, callback) {
    	loggedUser = onLogin(socket, token, loggedUser, callback);
    });

    socket.on('disconnect', function() {
    	onDisconnect(socket, loggedUser);
    });

    socket.on('logout', function() {
    	onLogout(socket, loggedUser);
    });

	socket.on('new-point', function(point) {
		// Emit the new point to all connected users
		io.emit('new-point', point);
	});

	socket.on('new-private-point', function(point, userId) {
		onNewPrivatePoint(socket, point, userId);
	});

	socket.on('verify-token', function(token, callback) {
		onVerifyToken(socket, token, callback);
	});

	socket.on('get-connected-users', function(callback) {
		onGetConnectedUsers(socket, callback);
	})
}

function initSocketIO(sio, siofu, uploadDir) {
	io = sio;
	socketIOFileUpload = siofu;
	UPLOAD_DIRECTORY = uploadDir;

	io.sockets.on('connection', computeConnection);
}

module.exports = initSocketIO;
