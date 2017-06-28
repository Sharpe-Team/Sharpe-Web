import React from 'react';
import { withRouter } from 'react-router';
import { userType, API_URL, handleAPIResult } from '../common/Common.jsx';

function requireAuth(Component, neededUserType, moderation) {

	class AuthenticationComponent extends React.Component {

		constructor(props) {
			super(props);
            
            console.log(moderation)

			this.state = {isAuthorized: false};

			this.checkAuth = this.checkAuth.bind(this);
            this.checkModeration = this.checkModeration.bind(this);
			this.storeUserInStorage = this.storeUserInStorage.bind(this);
			this.redirectToLogin = this.redirectToLogin.bind(this);
            this.getRuc = this.getRuc.bind(this);
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
			if(localStorage.getItem("token") != null) {
                var component = this;

				socket.emit('verify-token', localStorage.getItem("token"), function(user) {
					// Callback from server
					if(user) {
                        if(moderation == true){
                            if(!component.checkModeration(user)){
                                component.redirectToLogin();
                            }
                        } else if(neededUserType == userType.admin && user.admin != 1){
                            component.props.router.push('/notAuthorized');
                        }
                
                        component.storeUserInStorage(user);
                        component.setState({isAuthorized: true});
					} else {
                        component.redirectToLogin();
					}
				});
			} else {
                this.redirectToLogin();
			}
		}
        
        checkModeration(user) {
            console.log(user.circlesRole);
            return true;
        }
        
        getRuc(idUser) {
            const component = this;
            
            fetch(API_URL + 'rucs?user_id=' + idUser, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(rucs) {
                if(rucs) {
                    handleAPIResult(component, false, "");
                    localStorage.setItem('user-ruc', JSON.stringify(rucs));
                } else {
                    handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des liens avec les cercles...");
                }
            })
            .catch(function(error) {
                handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des liens avec les cercles...");
            });  
        }

		storeUserInStorage(user) {
            this.getRuc(user.id);
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