import React from 'react';
import { withRouter } from 'react-router';

function requireAuth(Component) {

	class AuthenticationComponent extends React.Component {

		constructor(props) {
			super(props);

			this.state = {isAuthorized: false};

			this.checkAuth = this.checkAuth.bind(this);
			this.redirectToLogin = this.redirectToLogin.bind(this);
			this.storeUserInStorage = this.storeUserInStorage.bind(this);
		}

		render() {

			return this.state.isAuthorized ? <Component { ...this.props } /> : null;
		}

		componentWillMount() {

			this.checkAuth();
		}

		checkAuth() {
			//console.log(localStorage.getItem("token"));

			if(localStorage.getItem("token") != null) {
				socket.emit('verify-token', localStorage.getItem("token"));
                
                var component = this;

                // Define SocketIO events
                socket.on('verify-token-failure', function() {
                    localStorage.clear();
                    component.redirectToLogin();
                });

                socket.on('verify-token-success', function(user) {
                	if(user.id != localStorage.getItem('user-id')) {
                    	component.storeUserInStorage(user);
                   	} 
                    component.setState({isAuthorized: true});
                });
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

		storeUserInStorage(user) {
			localStorage.setItem('user-id', user.id);
			localStorage.setItem('user-firstname', user.firstname);
			localStorage.setItem('user-lastname', user.lastname);
			localStorage.setItem('user-email', user.email);
			localStorage.setItem('user-profile-picture', user.profilePicture);
		}
	}

	return withRouter(AuthenticationComponent);
}

export default requireAuth;