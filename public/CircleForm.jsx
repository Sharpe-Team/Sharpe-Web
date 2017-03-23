import React from 'react';
import {Link} from 'react-router';

class CircleForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {circleName: ""};

		this.handleChange = this.handleChange.bind(this);
		this.handleFileUpload = this.handleFileUpload.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

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
										<label htmlFor="name-circle" className="text-right middle">Nom : </label>
									</div>
									<div className="column medium-7">
										<input type="text" id="name-circle" name="circleName" onChange={this.handleChange}/>
									</div>
								</div>
								<div className="row">
									<div className="column medium-5">
										<label htmlFor="" className="text-right middle">Ajouter une photo de profil : </label>
									</div>
									<div className="column medium-7">
										<label htmlFor="profile-picture" className="button">Photo de profil</label>
										<input type="file" id="profile-picture" name="profilePicture" className="show-for-sr" accept=".jpg, .png, .jpeg" onChange={this.handleFileUpload}/>
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

		// Do something on upload progress:
	    siofu.addEventListener("progress", function(event){
	        var percent = event.bytesLoaded / event.file.size * 100;
	        console.log("File is", percent.toFixed(2), "percent loaded");
	    });

	    // Do something when a file is uploaded:
	    siofu.addEventListener("complete", function(event) {
	        console.log(event.success);
	        console.log(event.file);
	    });

	    siofu.listenOnSubmit(document.getElementById("submit-btn"), document.getElementById("profile-picture"));
	}

	handleChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}

	handleFileUpload(event) {
		const file = event.target.files[0];
		console.log(file);
		this.setState({[event.target.name]: file});
	}

	handleSubmit(event) {

		event.preventDefault();
	}
}

export default CircleForm;