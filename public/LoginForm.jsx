import React from 'react';
import {Link, browserHistory} from 'react-router';
import passwordHash from 'password-hash';

class LoginForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			error: {
				showError: false,
				message: ""
			},
            displayLoading: "none"
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.clientConnection = this.clientConnection.bind(this);
		this.handleClosingAlert = this.handleClosingAlert.bind(this);
		this.handleShowingAlert = this.handleShowingAlert.bind(this);
		this.goToNextPage = this.goToNextPage.bind(this);
		this.storeUserInStorage = this.storeUserInStorage.bind(this);
	}

	render() {
		return (
			<div className="login-form-root">
                
                <div className="loading" style={{display: this.state.displayLoading}}>
                    <div className="row spinner">
                        <div className="medium-1 rect1"></div>
                        <span className="medium-1"></span> 
                        <div className="medium-1 rect2"></div>
                        <span className="medium-1"></span>   
                        <div className="medium-1 rect3"></div>
                        <span className="medium-1"></span> 
                        <div className="medium-1 rect4"></div>
                        <span className="medium-1"></span> 
                        <div className="medium-1 rect5"></div>
                    </div>
                </div>
                
                <img className="expanded row align-center logo" src="/resource/logo.png"/>
                
				<form onSubmit={this.handleSubmit}>
					<div className="expanded row align-center">
						<div className="column medium-4">
							<fieldset className="fieldset form-fieldset">
								
								{this.state.error.showError &&
									<div id="error-message" className="alert callout">
										<p>{this.state.error.message}</p>
										<button className="close-button" aria-label="Dismiss alert" type="button" onClick={this.handleClosingAlert}>
											<span aria-hidden="true">&times;</span>
										</button>
									</div>
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
		var component = this;

		socket.on('login-response', function(user) {
			component.storeUserInStorage(user);
			component.goToNextPage();
		});
	}

	handleChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}

	handleSubmit(event) {
        this.setState({displayLoading: "block"});
        this.setState({
			error: {
				showError: false
			}
		});
        
		event.preventDefault();

		var hashedPassword = this.state.userPassword; //passwordHash.generate(this.state.userPassword);

		this.clientConnection(this.state.userEmail, hashedPassword);
	}

	handleClosingAlert() {
		this.setState({
			error: {
				showError: false
			}
		});
	}

	handleShowingAlert(message) {
		this.setState({
			error: {
				showError: true,
				message: message
			}
		});
	}

	goToNextPage() {
		var redirect = this.props.location.query.redirect;
		var nextPage = (redirect) ? redirect : '/app';
		console.log(nextPage);
		browserHistory.push(nextPage);
	}

	storeUserInStorage(user) {
		localStorage.setItem('user-id', user.id);
		localStorage.setItem('user-firstname', user.firstname);
		localStorage.setItem('user-lastname', user.lastname);
		localStorage.setItem('user-email', user.email);
		localStorage.setItem('user-profile-picture', user.profilePicture);
	}

	clientConnection(email, hashedPassword) {
		var component = this;

		console.log(email, hashedPassword);

		fetch('http://localhost:8080/login', {
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
			return (response.status == 200) ? response : response.json();
		})
		.then(function(response) {
			if(response.status == 200) {
				component.setState({
					error: {
						showError: false,
					}
				});

				var authorizationHeader = response.headers.get('Authorization');
				var token = authorizationHeader.split(" ")[1];

				localStorage.setItem('token', token);
				socket.emit('login', token);
			} else {
                component.setState({displayLoading: "none"});
				component.setState({
					error: {
						showError: true,
						message: response.message
					}
				});
			}
		})
		.catch(function(error) {
            component.setState({displayLoading: "none"});
			console.log(error);
			console.log(error.status, error.error, error.message);

			component.setState({
				error: {
					showError: true,
					message: error.toString()
				}
			});
		});
	}
}

export default LoginForm;