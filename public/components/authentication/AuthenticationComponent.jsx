import React from 'react';
import { withRouter } from 'react-router';
import { userType, API_URL, handleAPIResult, getUserFromStorage } from '../common/Common.jsx';

function requireAuth(Component, neededUserType, moderation) {

	class AuthenticationComponent extends React.Component {

		constructor(props) {
			super(props);

			this.state = {
				isAuthorized: false
			};

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
			const component = this;
			
			socket.on('disconnected-user', function(user) {
				if(!localStorage.getItem('user-id')) {
					component.redirectToLogin(component.props);
				}
			});

            this.checkAuth();
		}

		checkAuth() {
			const component = this;

			if(localStorage.getItem("token") != null) {
				socket.emit('verify-token', localStorage.getItem("token"), function(userFromToken) {
					// Callback from server
					let user = getUserFromStorage();
					if(!user || user.id != userFromToken.id) {
						user = userFromToken;
						component.storeUserInStorage(user);
					}

					if(user) {
                        component.getRuc(user.id);
					} else {
                        component.redirectToLogin();
					}
				});
			} else {
                this.redirectToLogin();
			}
		}
        
        checkModeration(rucs) {
            for (let i=0; i<rucs.length; i++) {
                if(rucs[i].idCircle == this.props.params.circleId && rucs[i].idRole == 2) {
					return true;
				}
            }
            return false;
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

                    // CHECK USER RIGHTS
					if((moderation && !component.checkModeration(rucs)) ||
				        (neededUserType == userType.admin && user.admin != 1)) {
						component.redirectToNotAuthorized();
					}

					component.setState({
						isAuthorized: true
					});
                } else {
                    handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des liens avec les cercles...");
                }
            })
            .catch(function(error) {
                handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des liens avec les cercles...");
            });  
        }

		storeUserInStorage(user) {
            //this.getRuc(user.id);
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
        
        redirectToNotAuthorized() {
            this.props.router.push('/notAuthorized');
        }
	}

	return withRouter(AuthenticationComponent);
}

export default requireAuth;