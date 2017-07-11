import React from 'react';
import {Link, browserHistory} from 'react-router';
import passwordHash from 'password-hash';
import Loading from '../common/Loading.jsx';
import ErrorComponent from '../common/ErrorComponent.jsx';
import { API_URL, hideError, handleAPIResult, displayLoading } from '../common/Common.jsx';

class LoginForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			error: {
				showError: false,
				message: ""
			},
            displayLoading: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.clientConnection = this.clientConnection.bind(this);
		this.goToNextPage = this.goToNextPage.bind(this);
		this.storeUserInStorage = this.storeUserInStorage.bind(this);
	}

	render() {
        
		return (
			<div className="login-form-root">
                {this.state.displayLoading && 
                	<Loading loadingFrom="LoginForm"/>
                }
                
                <img className="expanded row align-center logo" src="/resource/logo.png"/>
                
				<form onSubmit={this.handleSubmit}>
					<div className="expanded row align-center">
						<div className="column medium-4">
							<fieldset className="fieldset form-fieldset">
								{this.state.error.showError &&
									<ErrorComponent message={this.state.error.message} hideError={hideError.bind(this, this)} />
								}

								<div className="row">
									<div className="column medium-12">
										<label>
											<b>Email</b>
											<input type="email" id="user-email" name="userEmail" onChange={this.handleChange} required/>
										</label>
									</div>
								</div>

								<div className="row">
									<div className="column medium-12">
										<label>
											<b>Mot de passe</b>
											<input type="password" id="user-password" name="userPassword" onChange={this.handleChange} required/>
										</label>
									</div>
								</div>

								<div className="row align-center">
									<Link to="/forgotPassword">J'ai oublié mon mot de passe</Link>
								</div>

								<div className="row align-center">
									<div className="column medium-8">
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

	componentWillMount() {
	}

	handleChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();

		var hashedPassword = this.state.userPassword; //passwordHash.generate(this.state.userPassword);

		this.clientConnection(this.state.userEmail, hashedPassword);
	}

	goToNextPage() {
		var redirect = this.props.location.query.redirect;
		var nextPage = (redirect) ? redirect : '/app';
		browserHistory.push(nextPage);
	}

	storeUserInStorage(user) {
		localStorage.setItem('user-id', user.id);
		localStorage.setItem('user-firstname', user.firstname);
		localStorage.setItem('user-lastname', user.lastname);
		localStorage.setItem('user-email', user.email);
		localStorage.setItem('user-profile-picture', user.profilePicture);
		localStorage.setItem('user-admin', user.admin);
	}

	clientConnection(email, hashedPassword) {
		const component = this;

        displayLoading(this);
		fetch(API_URL + 'login', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: email,
				password: hashedPassword
			})
		})
		.then(function(response) {
			return (response.status === 200) ? response : response.json();
		})
		.then(function(response) {
			if(response.status === 200) {
				handleAPIResult(component, false, "");

				let authorizationHeader = response.headers.get('Authorization');
				let token = authorizationHeader.split(" ")[1];

				localStorage.setItem('token', token);
				socket.emit('login', token, function(user) {
					component.storeUserInStorage(user);
					component.goToNextPage();
				});
			} else {
				handleAPIResult(component, true, response.message);
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est survenue lors de l'authentification...");
		});
	}
}

export default LoginForm;