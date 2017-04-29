// Import lib
var nJwt = require('njwt');
var io;
var socketIOFileUpload;

// CONSTANTS
const SECRET_KEY = "ThisIsASecret";
const ALGORITHM = 'HS512';
var UPLOAD_DIRECTORY;

var connectedUsersMap = new Map();

function isPresent(list, user) {
	for (var i = 0; i < list.length; i++) {
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

function onLogin(socket, token, loggedUser) {
	var decodedToken;

	if(token && (decodedToken = getDecodedToken(token))) {
		if(connectedUsersMap.has(token)) {
			// The current socket is the new socket of a previous connected user
			// Assign to this new socket the previous data of the user
			loggedUser = connectedUsersMap.get(token);
			loggedUser.disconnected = false;
		} else {
			// Add a new user in the list of connected users
	    	loggedUser = {
				token: token,
				user: decodedToken.body.user,
				disconnected: false
			};
			connectedUsersMap.set(token, loggedUser);
			
    		// Send info user to all clients except current client
    		socket.broadcast.emit('new-connected-user', loggedUser.user);
		}

		console.log("login : " + loggedUser.user.email);

		// Send info user to client
		socket.emit('login-response', loggedUser.user);
	} else {
		console.log("Unregistered user connected...");
	}

	console.log(connectedUsersMap.size);
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
	console.log("logout : " + loggedUser.user.email);
	socket.broadcast.emit('disconnected-user', loggedUser.user);
	connectedUsersMap.delete(loggedUser.token);
}

function computeConnection(socket) {
	/**
	 * Logged user of the socket
	 */
	var loggedUser = {
		token: null,
		user: null,
		disconnected: false
	};

	computeFileUpload(socket);

    socket.on('login', function(token) {
    	loggedUser = onLogin(socket, token, loggedUser);
    });

    socket.on('disconnect', function() {
    	onDisconnect(socket, loggedUser);
    });

    socket.on('logout', function() {
    	onLogout(socket, loggedUser);
    });

	socket.on('new-point', function(point) {
		// Add info of the point's sender
		// point.user = loggedUser.user;

		// Emit the new point to all connected users
		io.emit('new-point', point);
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
