import React from 'react';
import {Link, browserHistory} from 'react-router';
import passwordHash from 'password-hash';

class UserForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
            percent: 25
        };

		this.handleChange = this.handleChange.bind(this);
		this.handlePasswordAgainChange = this.handlePasswordAgainChange.bind(this);
		this.handleFileUpload = this.handleFileUpload.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.createUser = this.createUser.bind(this);

		this.checkForm = this.checkForm.bind(this);
	}

	render() {
		return (
			<div className="user-form-root">
				<Link to="/app"><img className="home-button" src="/resource/home.png"></img></Link>

				<form onSubmit={this.handleSubmit}>
					<div className="expanded row align-center">
						<div className="column medium-6">
                            <h2 className="form-title">Création d'un nouvel utilisateur</h2>
							<fieldset className="fieldset form-fieldset">
								<div className="row">
									<div data-tooltip aria-haspopup="true" title="Le prénom doit commencer par une majuscule et suivi de lettres minuscules" className="column medium-4">
										<label htmlFor="user-firstname" className="text-right middle">Prénom</label>
									</div>
                                    <div className="colum medium-1"></div>
									<div className="column medium-7">
										<input type="text" id="user-firstname" name="userFirstname" onChange={this.handleChange} maxLength="30" pattern="^[A-Z][a-z]{1,30}$" aria-describedby="firstname-help" required/>
									</div>
								</div>

								<div className="row">
									<div data-tooltip aria-haspopup="true" title="Le nom doit commencer par une majuscule et suivi de lettres minuscules. Le nom peut comporter plusieurs mots." className="column medium-4">
										<label htmlFor="user-lastname" className="text-right middle">Nom</label>
									</div>
                                    <div className="colum medium-1"></div>
									<div className="column medium-7">
										<input type="text" id="user-lastname" name="userLastname" onChange={this.handleChange} maxLength="30" pattern="^([A-Z][a-z]{1,30})( [A-Z][a-z]{1,30})*$" aria-describedby="lastname-help" required/>
									</div>
								</div>

								<div className="row">
									<div data-tooltip aria-haspopup="true" title="L'adresse email doit respecter les normes usuelles." className="column medium-4">
										<label htmlFor="user-email" className="text-right middle">Email</label>
									</div>
                                    <div className="colum medium-1"></div>
									<div className="column medium-7">
										<input type="email" id="user-email" name="userEmail" onChange={this.handleChange} aria-describedby="email-help" required/>
									</div>
								</div>

								<div className="row">
									<div data-tooltip aria-haspopup="true" title="Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et/ou un caractère spécial. Il doit contenir au moins 8 caractères." className="column medium-4">
										<label htmlFor="user-password" className="text-right middle">Mot de passe</label>
									</div>
                                    <div className="colum medium-1"></div>
									<div className="column medium-7">
										<input type="password" id="user-password" name="userPassword" onChange={this.handleChange} pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" aria-describedby="password-help" required/>
									</div>
								</div>

								<div className="row">
									<div data-tooltip aria-haspopup="true" title="Saisissez à nouveau le mot de passe" className="column medium-4">
										<label htmlFor="user-password-again" className="text-right middle">Mot de passe (vérification)</label>
									</div>
                                    <div className="colum medium-1"></div>
									<div className="column medium-7">
										<input type="password" id="user-password-again" name="userPasswordAgain" onChange={this.handlePasswordAgainChange} pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" aria-describedby="password-again-help" required/>
									</div>
								</div>

								<div className="row">
									<div className="column medium-4">
										<label htmlFor="" className="text-right middle">Ajouter une photo de profil</label>
									</div>
                                    <div className="colum medium-1"></div>
									<div className="column medium-7">
										<label htmlFor="profile-picture" className="button">Photo de profil</label>
										<input type="file" id="profile-picture" name="profilePicture" className="show-for-sr" accept="image/*" onChange={this.handleFileUpload}/>
                                        <progress max="100" value={this.state.percent}></progress>
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

	}

	handleChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}

	handlePasswordAgainChange(event) {
		if(this.state.userPassword != event.target.value) {
			event.target.setCustomValidity("Le mot de passe doit être identique à celui saisi ci-dessus");
		} else {
			event.target.setCustomValidity("");
		}

		this.setState({[event.target.name]: event.target.value});
	}

	handleFileUpload(event) {
		this.setState({[event.target.name]: event.target.files[0]});
	}

	handleSubmit(event) {
		event.preventDefault();

		if(!this.checkForm()) {
			return;
		}

		var component = this;

		var socket = io.connect();
		var siofu = new SocketIOFileUpload(socket);
		var files = [];

		// Do something on upload progress:
	    siofu.addEventListener("progress", function(event) {
	        var percent = event.bytesLoaded / event.file.size * 100;
	        component.setState({percent: percent});
	    });

	    // Do something when a file is uploaded:
	    siofu.addEventListener("complete", function(event) {
	        console.log(event.success);
	        console.log(event.file);

	        // If the files were uploaded successfuly, save the user in the DataBase
	        if(event.success) {
	        	component.createUser();
	        } else {
	        	alert("Une erreur est apparue lors de l'envoi des images...");
	        }
	    });

	    if(this.state.profilePicture instanceof File) {
	    	files.push(this.state.profilePicture);
	    }
	    if(files.length > 0) {
			siofu.submitFiles(files);
	    } else {
	    	this.createUser();
	    }
	}

	createUser() {
		var component = this;

		//var hashedPassword = passwordHash.generate(component.state.userPassword);

		fetch('http://localhost:8080/users/subscribe', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjb2NvQGFzdGljb3QuZnIiLCJleHAiOjE0OTE3MzY1NzJ9.i8bmwwMrWpz_X1ft7ymAvHacyp3RdZQ0T5M50MT3tU10Q9f-4Ci68JOllhjWMrrIgjvAMq6rN9wNCErVANEhvA',
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				firstname: component.state.userFirstname,
				lastname: component.state.userLastname,
				email: component.state.userEmail,
				password: hashedPassword,
				profilePicture: component.state.profilePicture
			})
		})
		.then(function(response) {
			return response;
		})
		.then(function(response) {
			alert("L'utilisateur a été ajouté avec succès !");
			browserHistory.push('/');
		})
		.catch(function(error) {
			console.log(error);
			alert("Une erreur est survenue lors de la création du nouvel utilisateur !");
		});
	}

	checkForm() {

		var password1 = this.state.userPassword;
		var password2 = this.state.userPasswordAgain;

		if(password1 != password2) {
			return false;
		}

		return true;
	}
}

export default UserForm;