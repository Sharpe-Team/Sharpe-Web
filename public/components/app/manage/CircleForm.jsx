import React from 'react';
import {Link, browserHistory} from 'react-router';
import { API_URL, hideError, handleAPIResult, displayLoading } from '../../common/Common.jsx';
import Loading from '../../common/Loading.jsx';
import ErrorComponent from '../../common/ErrorComponent.jsx';
import ImageUploadItem from './ImageUploadItem.jsx';

class CircleForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			circleName: "",
			users: [],
			lastModifiedPicture: undefined,
            error: {
				showError: false,
				message: ""
			},
            displayLoading: false,
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleMultipleSelectChange = this.handleMultipleSelectChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
        
        this.handleImageUpload = this.handleImageUpload.bind(this);

		this.getAllUsers = this.getAllUsers.bind(this);
		this.createCircle = this.createCircle.bind(this);
	}

	render() {
		return (
			<div className="circle-form-root">
				{this.state.displayLoading && 
                	<Loading loadingFrom="CircleForm"/>
                }
                
                <Link to="/app"><img className="home-button" src="/resource/home.png"></img></Link>

                <div className="reveal" id="modalProfilePicturePreview" data-reveal>
                	<img src={"/upload/" + this.state.profilePicture} width="200" />
                </div>

                <div className="reveal" id="modalBannerPicturePreview" data-reveal>
                	<img src={"/upload/" + this.state.bannerPicture} width="200" />
                </div>

				<form onSubmit={this.handleSubmit}>
					<div className="expanded row align-center">
						<div className="column medium-6">
                            <h2 className="form-title">Ajout d'un nouveau cercle</h2>
                            {this.state.error.showError &&
								<ErrorComponent message={this.state.error.message} hideError={hideError.bind(this, this)} />
							}

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
                                <ImageUploadItem id="profile-picture" onChange={this.handleImageUpload} name="profilePicture" label="Ajouter une photo de profil" buttonLabel="Photo de profil" siofu={new SocketIOFileUpload(socket)}/>
                                <ImageUploadItem id="banner-picture" onChange={this.handleImageUpload} name="bannerPicture" label="Ajouter une bannière" buttonLabel="Bannière" siofu={new SocketIOFileUpload(socket)}/>
								<div className="row">
									<div data-tooltip aria-haspopup="true" className="has-tip" title="Vous pouvez sélectionner plusieurs modérateurs. Vous pouvez taper les premières lettres du modérateur pour le retrouver plus facilement." className="column medium-4 form-label">
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

		/*var component = this;
        
        /!\ LE CODE CI DESSOUS DOIT ÊTRE AJOUTE AU NOUVEAU COMPOSANT MAIS OU ET COMMENT ? /!\

        // Ajouté dans ImageUploadItem, cela modifie son state pour avoir le event.name
	    siofu.addEventListener("load", function(event) {
	    	// Save the name given by the server to the current picture
	    	component.setState({[component.state.lastModifiedPicture]: event.name});
	    });

        // Pas ajouté du tout
		siofu.addEventListener("complete", function(event) {
			if(event.success) {
				// Save the final path of the latest modified picture
				component.saveFinalPathOfLastModifiedPicture(event.file);
			} else {
				component.setState({
					[component.state.lastModifiedPicture]: undefined
				});
				alert("Une erreur est survenue lors de l'envoi des images...");
			}
		});*/
	}

	componentWillMount() {
		this.getAllUsers();
	}

	saveFinalPathOfLastModifiedPicture(file) {

		var finalName = this.state[this.state.lastModifiedPicture];
		var currentName = file.name;
		var extension = currentName.substring(currentName.indexOf("."));
		var finalPath = finalName + extension;

		this.setState({
			[this.state.lastModifiedPicture]: finalPath
		});
	}
    
    handleImageUpload(event) {
		event.preventDefault();
        
		this.setState({
			[event.target.name]: event.state.image
		});
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

	handleSubmit(event) {
		event.preventDefault();

		this.createCircle();
	}

	createCircle() {
		var component = this;

        displayLoading(this);
		fetch(API_URL + 'circles', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
			},
			body: JSON.stringify({
				name: component.state.circleName,
				//moderators: component.state.moderators,
				pictureUrl: component.state.profilePicture,
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
            	handleAPIResult(component, false, "");
				// redirect to main file 'App'
				browserHistory.push('/app');
			} else {
				handleAPIResult(component, true, "Une erreur est survenue lors de la création du nouveau cercle !");
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est survenue lors de la création du nouveau cercle !");
		});
	}

	getAllUsers() {
		var component = this;

		fetch(API_URL + 'users', {
			method: 'GET',
			headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(users) {
			if(users) {
            	handleAPIResult(component, false, "");
				component.setState({users: users});
			} else {
				handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des utilisateurs !");
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des utilisateurs !");
		});
	}
}

export default CircleForm;
