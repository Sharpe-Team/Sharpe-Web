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
var socketIOFileUpload = require('socketio-file-upload');

var rootPathView = __dirname + '/public';

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

// Gestion des sockets avec les clients
io.sockets.on('connection', function (socket) {

	/**
	* Utilisateur connecté à la socket
	*/
	var loggedUser;

	console.log("New Connection !!");

	socket.on('new-point', function(point) {
		// Emit the new point to all connected users
		io.emit('new-point', point);
	});

	// Make an instance of SocketIOFileUpload and listen on this socket:
    var uploader = new socketIOFileUpload();
    uploader.dir = "./uploads";
    uploader.listen(socket);

    // Do something when a file is saved:
    uploader.on("saved", function(event) {
        console.log(event.file);
    });

    // Error handler:
    uploader.on("error", function(event) {
        console.log("Error from uploader", event);
    });
});

/**
* Lancement du serveur en écoutant les connexions arrivant sur le port 3000
*/
http.listen(3000, function () {
	console.log('Server is listening on *:3000');
	notifier.notify('Le serveur a démarré et écoute sur le port 3000...');
});
