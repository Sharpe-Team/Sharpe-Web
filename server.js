var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var notifier = require('node-notifier');

var rootPathView = __dirname + '/public';

/**
 * Gestion des requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
 */
app.use(express.static(__dirname + '/public'));

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

/**

FAIRE API REST COMME SUIT :

app.get('/users', function(req, res) {
	Récupère tous les users depuis la BDD et les renvoie en JSON
});

*/

// Gestion des sockets avec les clients
io.sockets.on('connection', function (socket) {

	/**
	* Utilisateur connecté à la socket
	*/
	var loggedUser;

	console.log("New Connection !!");
	io.emit('init', 'toto');

	/**
	* Déconnexion d'un utilisateur
	*/
	socket.on('my-event', function () {
		//do something
	});
});

/**
* Lancement du serveur en écoutant les connexions arrivant sur le port 3000
*/
http.listen(3000, function () {
	console.log('Server is listening on *:3000');
	notifier.notify('Le serveur a démarré et écoute sur le port 3000...');
});
