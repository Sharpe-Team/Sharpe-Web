import React from 'react';
import { withRouter } from 'react-router';

function requireAuth(Component) {

	class AuthenticationComponent extends React.Component {

		constructor(props) {
			super(props);

			this.state = {isAuthorized: false};

			this.checkAuth = this.checkAuth.bind(this);
			this.redirectToLogin = this.redirectToLogin.bind(this);
		}

		render() {

			return this.state.isAuthorized ? <Component { ...this.props } /> : null;
		}

		componentWillMount() {
			this.checkAuth();
		}

		checkAuth() {
			console.log(localStorage.getItem("token"));

			if(localStorage.getItem("token") != null) {
				var token = localStorage.getItem("token");

				// Check validity of the token. If valid, authorize access to the route
				/*
				fetch('http://localhost:8080/checkTokenValidity?token=' + token, {
					method: 'GET',
					mode: 'cors'
				})
				.then(function(response) {
					return response.json();
				})
				.then(function(response) {
					// Store the new token with TTL refreshed
					if(response.status == 200) {
						localStorage.setItem('token', response.token);
						this.state.setState({isAuthorized: true});
					}
				})
				.catch(function(error) {
					this.redirectToLogin();
				});
				*/

				localStorage.setItem('token', token);
				this.setState({isAuthorized: true});
			} else {
				this.redirectToLogin();
			}
		}

		redirectToLogin() {
			console.log("Not Authorized !");

			const location = this.props.location;
			const redirect = location.pathname + location.search;

			this.props.router.push('/?redirect=' + redirect);
		}
	}

	return withRouter(AuthenticationComponent);
}

export default requireAuth;