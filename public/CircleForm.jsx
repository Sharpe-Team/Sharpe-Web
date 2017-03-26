import React from 'react';
import {Link, browserHistory} from 'react-router';

class CircleForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			circleName: "",
			users: [{
						id: 1,
						name: "Toto"
					},
					{
						id: 2,
						name: "Lala"
					},
					{
						id: 3,
						name: "Lili"
					}]
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleMultipleSelectChange = this.handleMultipleSelectChange.bind(this);
		this.handleFileUpload = this.handleFileUpload.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.getAllUsers = this.getAllUsers.bind(this);
		this.createCircle = this.createCircle.bind(this);
	}

	render() {
		return (
			<div>
				<p>Cirlce form</p>
				<Link to="/">Home</Link>

				<form onSubmit={this.handleSubmit}>
					<div className="expanded row align-center">
						<div className="column medium-6">
							<fieldset className="fieldset">
								<legend>Création d'un nouveau cercle</legend>
								<div className="row">
									<div className="column medium-5">
										<label htmlFor="circle-name" className="text-right middle">Nom : </label>
									</div>
									<div className="column medium-7">
										<input type="text" id="circle-name" name="circleName" onChange={this.handleChange} required/>
									</div>
								</div>
								<div className="row">
									<div className="column medium-5">
										<label htmlFor="" className="text-right middle">Ajouter une photo de profil : </label>
									</div>
									<div className="column medium-7">
										<label htmlFor="profile-picture" className="button">Photo de profil</label>
										<input type="file" id="profile-picture" name="profilePicture" className="show-for-sr" accept=".jpg, .png, .jpeg, .gif" onChange={this.handleFileUpload}/>
									</div>
								</div>
								<div className="row">
									<div className="column medium-5">
										<label htmlFor="" className="text-right middle">Ajouter une photo de bannière : </label>
									</div>
									<div className="column medium-7">
										<label htmlFor="banner-picture" className="button">Photo de la bannière</label>
										<input type="file" id="banner-picture" name="bannerPicture" className="show-for-sr" accept=".jpg, .png, .jpeg, .gif" onChange={this.handleFileUpload}/>
									</div>
								</div>
								<div className="row">
									<div className="column medium-5">
										<label htmlFor="moderators" className="text-right middle">Liste des modérateurs : </label>
									</div>
									<div className="column medium-7">
										<select id="moderators" name="moderators" onChange={this.handleMultipleSelectChange} aria-describedby="select-help" multiple required>
											{
												this.state.users.map(function(user) {
													return <option key={user.id} value={user.id}>{user.name}</option>
												})
											}
										</select>
										<p id="select-help" className="help-text">Vous pouvez sélectionner plusieurs modérateurs. Vous pouvez taper les premières lettres du modérateur pour le retrouver plus facilement.</p>
									</div>
								</div>

								<div className="row align-center">
									<div className="column medium-4">
										<button type="submit" id="submit-btn" className="button expanded">Valider</button>
									</div>
								</div>
							</fieldset>
						</div>
					</div>
				</form>
			</div>
		);
	}

	componentDidMount() {

		var socket = io.connect();
		var siofu = new SocketIOFileUpload(socket);

		socket.on('init', function(username) {
			console.log("Receive 'init' event !!");
			console.log('Mon nom : ' + username);
		});

	    //siofu.listenOnSubmit(document.getElementById("submit-btn"), document.getElementById("profile-picture"));
	    //siofu.listenOnSubmit(document.getElementById("submit-btn"), document.getElementById("banner-picture"));
	}

	handleChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}

	handleMultipleSelectChange(event) {
		var options = event.target.options;
		var selectedOptions = [];

		for(var i=0; i<options.length; i++) {
			if(options[i].selected) {
				selectedOptions.push(options[i].value);
			}
		}

		this.setState({[event.target.name]: selectedOptions});
	}

	handleFileUpload(event) {
		const file = event.target.files[0];
		console.log(file);
		this.setState({[event.target.name]: file});
	}

	handleSubmit(event) {
		event.preventDefault();
		var component = this;

		var socket = io.connect();
		var siofu = new SocketIOFileUpload(socket);
		var files = [];

		// Do something on upload progress:
	    siofu.addEventListener("progress", function(event) {
	        var percent = event.bytesLoaded / event.file.size * 100;
	        console.log("File is", percent.toFixed(2), "percent loaded");
	    });

	    // Do something when a file is uploaded:
	    siofu.addEventListener("complete", function(event) {
	        console.log(event.success);
	        console.log(event.file);

	        // If the files were uploaded successfuly, save the circle in the DataBase
	        if(event.success) {
	        	component.createCircle();
	        } else {
	        	alert("Une erreur est apparue lors de l'envoi des images...");
	        }
	    });

	    if(this.state.profilePicture instanceof File) {
	    	files.push(this.state.profilePicture);
	    }
	    if(this.state.bannerPicture instanceof File) {
	    	files.push(this.state.bannerPicture);
	    }
	    if(files.length > 0) {
			siofu.submitFiles(files);
	    } else {
	    	this.createCircle();
	    }
	}

	createCircle() {
		var component = this;

		console.log(component.state.moderators);

		fetch('http://localhost:8080/circle', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				circleName: component.state.circleName,
				moderators: component.state.moderators
			})
		})
		.then(function(response) {
			return response;
		})
		.then(function(response) {
			alert("Le cercle a bien été ajouté !");
			// redirect to main file 'App'
			browserHistory.push('/');
		})
		.catch(function(error) {
			console.log(error);
			alert("Une erreur est survenue lors de la création du nouveau cercle !");
			browserHistory.push('/');
		});
	}

	getAllUsers() {
		var component = this;

		fetch('http://localhost:8080/users', {
			method: 'GET',
			mode: 'cors'
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(users) {
			component.setState({users: users});
		})
		.catch(function(error) {
			console.log(error);
		});
	}
}

export default CircleForm;
