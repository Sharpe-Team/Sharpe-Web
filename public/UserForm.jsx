import React from 'react';
import {Link, browserHistory} from 'react-router';
import passwordHash from 'password-hash';
import Loading from './Loading.jsx';

class UserForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
            percent: 0,
            displayLoading: "none"
        };

		this.handleChange = this.handleChange.bind(this);
		this.handlePasswordAgainChange = this.handlePasswordAgainChange.bind(this);
		this.handleFileUpload = this.handleFileUpload.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.createUser = this.createUser.bind(this);
		this.saveFinalPathOfProfilePicture = this.saveFinalPathOfProfilePicture.bind(this);

		this.checkForm = this.checkForm.bind(this);
	}

	render() {
		return (
			<div className="user-form-root">
                
                <Loading style={this.state.displayLoading}/>
                
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
                                        <div className="row">
                                            <label htmlFor="profile-picture" className="button">Photo de profil</label>
                                            <input type="file" id="profile-picture" name="profilePicture" className="show-for-sr" accept="image/*" onChange={this.handleFileUpload}/>
                                            <div className="medium-1"></div>
                                            <progress className="medium-centered" max="100" value={this.state.percent}></progress>
                                            <div className="medium-1"></div>
                                            <div>{this.state.percent}%</div>
                                        </div>
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
		var component = this;

		siofu.listenOnInput(document.getElementById("profile-picture"));

	    siofu.addEventListener("load", function(event) {
	    	// Save the name given by the server to the current picture
	    	component.state.profilePicture = event.name;
	    });

		// Do something on upload progress:
		siofu.addEventListener("progress", function(event) {
	        var percent = event.bytesLoaded / event.file.size * 100;
	        component.setState({percent: percent});
		});

		// Do something when a file is uploaded:
		siofu.addEventListener("complete", function(event) {
			if(event.success) {
				// Save the final path of the latest modified picture
				component.saveFinalPathOfProfilePicture(event.file);
			} else {
				component.setState({
					profilePicture: undefined
				});
				alert("Une erreur est survenue lors de l'envoi des images...");
			}
		});
	}

	saveFinalPathOfProfilePicture(file) {
		var finalName = this.state.profilePicture;
		var currentName = file.name;
		var extension = currentName.substring(currentName.indexOf("."));
		var finalPath = finalName + extension;

		this.setState({
			profilePicture: finalPath
		});
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
        this.setState({displayLoading: "block"});
        
		event.preventDefault();

		if(!this.checkForm()) {
			return;
		}
		
	    this.createUser();
	}

	createUser() {
		var component = this;

		//var hashedPassword = passwordHash.generate(component.state.userPassword);

		fetch('http://localhost:8080/users/subscribe', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			},
			body: JSON.stringify({
				firstname: component.state.userFirstname,
				lastname: component.state.userLastname,
				email: component.state.userEmail,
				password: component.state.userPassword,
				profilePicture: component.state.profilePicture
			})
		})
		.then(function(response) {
			return response;
		})
		.then(function(response) {
			if(response.status == 201) {
				alert("L'utilisateur a été ajouté avec succès !");
				browserHistory.push('/app');
			} else {
                this.setState({displayLoading: "none"});
				console.log(error);
				alert("Une erreur est survenue lors de la création du nouvel utilisateur !");
			}
		})
		.catch(function(error) {
            this.setState({displayLoading: "none"});
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