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
			}
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.clientConnection = this.clientConnection.bind(this);
		this.handleClosingAlert = this.handleClosingAlert.bind(this);
		this.handleShowingAlert = this.handleShowingAlert.bind(this);
	}

	render() {
		return (
			<div>
				<p>Login form</p>
				<Link to="/app">Home</Link>

				<form onSubmit={this.handleSubmit}>
					<div className="expanded row align-center">
						<div className="column medium-3">
							<fieldset className="fieldset">
								<legend>Connexion</legend>

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

	componentDidMount() {
	}

	handleChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}

	handleSubmit(event) {
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

	clientConnection(email, hashedPassword) {
		var component = this;

		console.log(email, hashedPassword);

		fetch('http://localhost:8080/login', {
			method: 'POST',
			//mode: 'cors',
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
			if(response.status == 200) {
				return response;
			} else {
				return response.json();
			}
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

				socket.on('login-response', function(user) {
					
				});

				var redirect = component.props.location.query.redirect;
				var nextPage = (redirect) ? redirect : '/app';
				console.log(nextPage);
				browserHistory.push(nextPage);
			} else {
				component.setState({
					error: {
						showError: true,
						message: response.message
					}
				});
			}
		})
		.catch(function(error) {
			console.log(error);
			console.log(error.status, error.error, error.message);

			component.setState({
				error: {
					showError: true,
					message: error.toString()
				}
			});
		});
		
		/*
		localStorage.setItem("token", email);
		socket.emit('login', email);

		var redirect = component.props.location.query.redirect;
		var nextPage = (redirect) ? redirect : '/app';
		console.log(nextPage);
		browserHistory.push(nextPage);
		*/
		

		/*
		socket.emit('login', {'email': email, 'password': hashedPassword});

		socket.on('login-response', function(data) {

			// If the user is successfully authenticated
			if(data.isAuthenticated) {
				// Clean error message
				component.handleClosingAlert();

				// Clean the localStorage and save the user and the token in it
				localStorage.clear();
				localStorage.setItem("user", data.user);
				localStorage.setItem("token", data.token);

				// Find the next page to redirect to
				var redirect = component.props.location.query.redirect;
				var nextPage = (redirect) ? redirect : '/app';

				browserHistory.push(nextPage);
			} else {
				// Show the error message
				component.handleShowingAlert(data.message.toString());
			}
		});
		*/
	}
}

export default LoginForm;