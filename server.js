/*
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './public/Routes.jsx';
import NotFoundPage from './public/NotFoundPage.jsx';
import path from 'path';
*/

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var notifier = require('node-notifier');
var path = require('path');
var fs = require('fs');
var nJwt = require('njwt');
var socketIOFileUpload = require('socketio-file-upload');

var rootPathView = __dirname + '/public';
const UPLOAD_DIRECTORY = __dirname + '/public/uploads';
const SECRET_KEY = "ThisIsASecret";
const ALGORITHM = 'HS512';

/**
 * Gestion des requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
 */
app.use(express.static(__dirname + '/public'));

app.use(socketIOFileUpload.router);
/*
app.set('view engine', 'html');
app.set('views', rootPathView);
*/

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

// universal routing and rendering
/*
app.get('*', (req, res) => {
	match({ routes, location: req.url }, 
		(err, redirectLocation, renderProps) => {

			// in case of error display the error message
			if (err) {
				return res.status(500).send(err.message);
			}

			// in case of redirect propagate the redirect to the browser
			if (redirectLocation) {
				return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
			}

			// generate the React markup for the current route
			let markup;
			if (renderProps) {
				// if the current route matched we have renderProps
				markup = renderToString(<RouterContext {...renderProps}/>);
			} else {
				// otherwise we can render a 404 page
				markup = renderToString(<NotFoundPage/>);
				res.status(404);
			}

			// render the index template with the embedded React markup
			return res.render('index', { markup });
		}
	);
});
*/

/*
app.get('/', function(req, res) {
	console.log("render index.html !!");
	res.sendFile('index.html', rootPathView);
});*/

/*

LA LIGNE "app.use(express.static(__dirname + '/public'));" PERMET DE GERER LES ROUTES POUR NOUS
IL RENVOIE LE FICHIER NOMME COMME LE NOM DE LA ROUTE ('/toto' va renvoyer le fichier 'toto.html')

SINON, ON PEUT GERER LES ROUTES A LA MAIN EN SPECIFIANT LA ROUTE POUR LAQUELLE ON VEUT RENVOYER UNE PAGE

app.get('/toto', function(req, res) {
	console.log("render in /toto");
	res.sendFile(rootPathView + '/index.html');
});
*/

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

// Gestion des sockets avec les clients
io.sockets.on('connection', function (socket) {

	console.log("New Connection !!");

	/**
	* Logged user of the socket
	*/
	var loggedUser = {
		token: null,
		user: null,
		disconnected: false
	};

	// Make an instance of SocketIOFileUpload and listen on this socket:
    var uploader = new socketIOFileUpload();
    uploader.dir = UPLOAD_DIRECTORY;
    uploader.listen(socket);

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
    		}
    	} else {
    		console.log("Unregistered user connected...");
    	}
		console.log(connectedUsersMap.size);
    });

    socket.on('disconnect', function() {
    	loggedUser.disconnected = true;

    	// The user get 10 seconds to reconnect
    	setTimeout(function() {
    		if(loggedUser.disconnected) {
    			connectedUsersMap.delete(loggedUser.token);
    		}
    	}, 10000);
    });

    socket.on('logout', function() {
		connectedUsersMap.delete(loggedUser.token);
    });

	socket.on('new-point', function(point) {
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


	/****************** SOCKET_IO_FILE_UPLOAD ******************/

    // Do something when a file is saved:
    uploader.on("saved", function(event) {
        console.log(event.file);
    });

    // Error handler:
    uploader.on("error", function(event) {
        console.log("Error from uploader", event);
    });
});

// Create directory for uploads if it doesn't exist
fs.mkdir(UPLOAD_DIRECTORY, 0777, function(err) {
	if (err && err.code != 'EEXIST') {
		console.log("An error happened while creating the 'upload' directory...", err);
	}
});

/**
* Lancement du serveur en écoutant les connexions arrivant sur le port 3000
*/
http.listen(3000, function () {
	console.log('Server is listening on *:3000');
	notifier.notify('Le serveur a démarré et écoute sur le port 3000...');
});
