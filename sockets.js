// Import lib
var socketIO = require('socket.io');
var nJwt = require('njwt');
var socketIOFileUpload = require('socketio-file-upload');

var connectedUsersMap = new Map();

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
        console.log(event);
    });

    // Error handler:
    uploader.on("error", function(event) {
        console.log("Error from uploader", event);
    });
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

    		// Send info user to client
    		socket.emit('login-response', loggedUser.user);
    	} else {
    		console.log("Unregistered user connected...");
    	}
		console.log(connectedUsersMap.size);
    });

    socket.on('disconnect', function() {
    	loggedUser.disconnected = true;

    	// The user gets 10 seconds to reconnect
    	setTimeout(function() {
    		if(loggedUser.disconnected && loggedUser.user) {
				socket.broadcast.emit('disconnected-user', loggedUser.user);
    			connectedUsersMap.delete(loggedUser.token);
    		}
    	}, 10000);
    });

    socket.on('logout', function() {
		socket.broadcast.emit('disconnected-user', loggedUser.user);
		connectedUsersMap.delete(loggedUser.token);
    });

	socket.on('new-point', function(point) {
		// Add info of the point's sender
		point.user = loggedUser.user;
		// Emit the new point to all connected users
		io.emit('new-point', point);
	});

	socket.on('verify-token', function(token) {
		var decodedToken = getDecodedToken(token);

		if(decodedToken) {
			socket.emit('verify-token-success', decodedToken.body.user);
		} else {
			socket.emit('verify-token-failure');
		}
	});

	socket.on('get-connected-users', function() {
		var listUsers = new Array();
		for(var [key, value] of connectedUsersMap) {
			listUsers.push(value.user);
		}

		socket.emit('get-connected-users-response', listUsers);
	})
}

function initSocketIO(app, http) {
	app.use(socketIOFileUpload.router);

	var io = socketIO.listen(http);

	// Gestion des sockets avec les clients
	io.sockets.on('connection', computeConnection(socket));
}

export default initSocketIO;
