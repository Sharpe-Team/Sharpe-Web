import React from 'react';
import {Link, browserHistory} from 'react-router';

class CircleForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			circleName: "",
			users: []
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
			<div className="circle-form-root">
                <Link to="/app"><img className="home-button" src="/resource/home.png"></img></Link>

				<form onSubmit={this.handleSubmit}>
					<div className="expanded row align-center">
						<div className="column medium-6">
                            <h2 className="form-title">Ajout d'un nouveau cercle</h2>
							<fieldset className="fieldset form-fieldset">
								<div className="row">
									<div className="column medium-4">
										<label htmlFor="circle-name" className="text-right middle form-label">Nom </label>
									</div>
                                    <div className="colum medium-1"></div>
									<div className="column medium-7">
										<input type="text" id="circle-name" name="circleName" onChange={this.handleChange} required/>
									</div>
								</div>
								<div className="row">
									<div className="column medium-4">
										<label htmlFor="" className="text-right middle form-label">Ajouter une photo de profil </label>
									</div>
                                    <div className="colum medium-1"></div>
									<div className="column medium-7">
										<label htmlFor="profile-picture" className="button">Photo de profil</label>
										<input type="file" id="profile-picture" name="profilePicture" className="show-for-sr" accept="image/*" onChange={this.handleFileUpload}/>
									</div>
								</div>
								<div className="row">
									<div className="column medium-4">
										<label htmlFor="" className="text-right middle form-label">Ajouter une photo de bannière </label>
									</div>
                                    <div className="colum medium-1"></div>
									<div className="column medium-7">
										<label htmlFor="banner-picture" className="button">Bannière</label>
										<input type="file" id="banner-picture" name="bannerPicture" className="show-for-sr" accept="image/*" onChange={this.handleFileUpload}/>
									</div>
								</div>
								<div className="row">
									<div data-tooltip aria-haspopup="true" class="has-tip" title="Vous pouvez sélectionner plusieurs modérateurs. Vous pouvez taper les premières lettres du modérateur pour le retrouver plus facilement." className="column medium-4 form-label">
										<label htmlFor="moderators" className="text-right middle">Liste des modérateurs</label>
									</div>
                                    <div className="colum medium-1"></div>
									<div className="column medium-7">
										<select id="moderators" name="moderators" onChange={this.handleMultipleSelectChange} aria-describedby="select-help" multiple required>
											{
												this.state.users.map(function(user) {
													return <option key={user.id} value={user.id}>{user.firstname} {user.lastname}</option>
												})
											}
										</select>
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

	    //siofu.listenOnSubmit(document.getElementById("submit-btn"), document.getElementById("profile-picture"));
	    //siofu.listenOnSubmit(document.getElementById("submit-btn"), document.getElementById("banner-picture"));
	}

	componentWillMount() {
		this.getAllUsers();
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

	        // If the files were uploaded successfuly, save the circle in the DB
	        if(event.success) {
	        	// Do nothing, the server send another event with the final path of the uploaded files
	        	component.createCircle();
	        } else {
	        	alert("Une erreur est survenue lors de l'envoi des images...");
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

		fetch('http://localhost:8080/circles', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
			},
			body: JSON.stringify({
				name: component.state.circleName,
				//moderators: component.state.moderators,
				pictureUrl: component.state.profilePicture.name,
				bannerPictureUrl: component.state.bannerPicture
			})
		})
		.then(function(response) {
			if(response.status == 201) {
				return response;
			} else {
				return response.json();
			}
		})
		.then(function(response) {
			if(response.status == 201) {
				alert("Le cercle a bien été ajouté !");
				// redirect to main file 'App'
				browserHistory.push('/app');
			} else {
				console.log(error);
				alert("Une erreur est survenue lors de la création du nouveau cercle !");
			}
		})
		.catch(function(error) {
			console.log(error);
			alert("Une erreur est survenue lors de la création du nouveau cercle !");
		});
	}

	getAllUsers() {
		var component = this;

		fetch('http://localhost:8080/users', {
			method: 'GET',
			headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
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
