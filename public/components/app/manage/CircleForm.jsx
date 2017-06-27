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
			moderators: [],
            error: {
				showError: false,
				message: ""
			},
            displayLoading: false,
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleMultipleSelectChange = this.handleMultipleSelectChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
        
        this.profilePictureHandler = this.profilePictureHandler.bind(this);
        this.bannerPictureHandler = this.bannerPictureHandler.bind(this);

		this.getAllUsers = this.getAllUsers.bind(this);
		this.createCircle = this.createCircle.bind(this);
	}

	render() {
		return (
			<div className="circle-form-root">
				{this.state.displayLoading && 
                	<Loading loadingFrom="CircleForm"/>
                }
                
                <Link to="/app"><img className="home-button" src="/resource/home-button.png"></img></Link>

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
									<div className="column medium-7 medium-offset-1">
										<input type="text" id="circle-name" name="circleName" onChange={this.handleChange} required/>
									</div>
								</div>
                                <ImageUploadItem id="profile-picture" name="profilePicture" label="Ajouter une photo de profil" buttonLabel="Photo de profil" callback={this.profilePictureHandler} />
                                <ImageUploadItem id="banner-picture" name="bannerPicture" label="Ajouter une bannière" buttonLabel="Bannière" callback={this.bannerPictureHandler} />
								<div className="row">
									<div data-tooltip aria-haspopup="true" className="column medium-4 form-label has-tip" title="Vous pouvez sélectionner plusieurs modérateurs. Vous pouvez taper les premières lettres du modérateur pour le retrouver plus facilement.">
										<label htmlFor="moderators" className="text-right middle">Liste des modérateurs</label>
									</div>
									<div className="column medium-7 medium-offset-1">
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
	}

	componentWillMount() {
		this.getAllUsers();
	}

	handleChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}

	handleMultipleSelectChange(event) {
		let options = event.target.options;
		let selectedOptions = [];

		for(let i=0; i<options.length; i++) {
			if(options[i].selected) {
				selectedOptions.push(options[i].value);
			}
		}

		this.setState({[event.target.name]: selectedOptions});
	}

	profilePictureHandler(pictureName) {
		this.setState({
			profilePicture: pictureName
		});
	}

	bannerPictureHandler(pictureName) {
		this.setState({
			bannerPicture: pictureName
		});
	}

	handleSubmit(event) {
		event.preventDefault();

		this.createCircle();
	}

	createCircle() {
		const component = this;

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
				moderatorsId: component.state.moderators,
				pictureUrl: component.state.profilePicture,
				bannerPictureUrl: component.state.bannerPicture,
				type: 1
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
				//alert("Le cercle a bien été ajouté !");
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
		const component = this;

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
