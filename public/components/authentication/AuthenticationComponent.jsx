import React from 'react';
import { withRouter } from 'react-router';
import { userType } from '../common/Common.jsx';

function requireAuth(Component, neededUserType) {

	class AuthenticationComponent extends React.Component {

		constructor(props) {
			super(props);

			this.state = {isAuthorized: false};

			this.checkAuth = this.checkAuth.bind(this);
			this.storeUserInStorage = this.storeUserInStorage.bind(this);
			this.redirectToLogin = this.redirectToLogin.bind(this);
		}

		render() {

			return this.state.isAuthorized ? <Component { ...this.props } /> : null;
		}

		componentWillMount() {
			var component = this;
			
			socket.on('disconnected-user', function(user) {
				if(!localStorage.getItem('user-id')) {
					component.redirectToLogin(component.props);
				}
			});

			this.checkAuth();
		}

		checkAuth() {
			//console.log(localStorage.getItem("token"));

			if(localStorage.getItem("token") != null) {
                var component = this;

				socket.emit('verify-token', localStorage.getItem("token"), function(user) {
					// Callback from server
					if(user) {
						if(user.id != localStorage.getItem('user-id')) {
                    		component.storeUserInStorage(user);
                   		}
                        if(neededUserType == userType.admin && user.admin != 1){
                            component.props.router.push('/notAuthorized');
                        }
                   		component.setState({isAuthorized: true});
					} else {
                		component.redirectToLogin();
					}
				});
			} else {
				this.redirectToLogin();
			}
		}

		storeUserInStorage(user) {
			localStorage.setItem('user-id', user.id);
			localStorage.setItem('user-firstname', user.firstname);
			localStorage.setItem('user-lastname', user.lastname);
			localStorage.setItem('user-email', user.email);
			localStorage.setItem('user-profile-picture', user.profilePicture);
            localStorage.setItem('user-admin', user.admin);
		}

		redirectToLogin() {	
			console.log("Not Authorized !");
		    localStorage.clear();

			const location = this.props.location;
			const redirect = location.pathname + location.search;

			this.props.router.push('/?redirect=' + redirect);
		}
	}

	return withRouter(AuthenticationComponent);
}

export default requireAuth;