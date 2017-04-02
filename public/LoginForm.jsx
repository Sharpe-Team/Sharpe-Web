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
	}

	render() {
		return (
			<div>
				<p>Login form</p>
				<Link to="/">Home</Link>

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

		var hashedPassword = passwordHash.generate(this.state.userPassword);

		this.clientConnection(this.state.userEmail, hashedPassword);
	}

	handleClosingAlert() {
		this.setState({
			error: {
				showError: false
			}
		});
	}

	clientConnection(email, hashedPassword) {
		var component = this;

		var params = "userEmail=" + email + 
					"&userPassword=" + hashedPassword;

		fetch('http://localhost:8080/userLogin?' + params, {
			method: 'GET',
			mode: 'cors'
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(authentication) {
			if(authentication.isAuthenticated) {
				component.setState({
					error: {
						showError: false,
					}
				});
				browserHistory.push('/app');
			} else {
				component.setState({
					error: {
						showError: true,
						message: "L'adresse email ou le mot de passe est incorrect."
					}
				});
			}
		})
		.catch(function(error) {
			console.log(error);
			component.setState({
				error: {
					showError: true,
					message: error.toString()
				}
			});

			localStorage.setItem("token", "bouh");

			var redirect = component.props.location.query.redirect;
			var nextPage = (redirect) ? redirect : '/app';
			console.log(nextPage);
			browserHistory.push(nextPage);
		});
	}
}

export default LoginForm;