import React from 'react';
import { Router, Route, browserHistory, withRouter } from 'react-router';
import LoginPage from './LoginForm.jsx';
import App from './App.jsx';
import CircleFormPage from './CircleForm.jsx';
import UserFormPage from './UserForm.jsx';
import NotFoundPage from './NotFoundPage.jsx';

function requireAuth(Component) {

	class AuthenticatedComponent extends React.Component {

		constructor(props) {
			super(props);

			this.checkAuth = this.checkAuth.bind(this);
		}

		render() {

			return localStorage.getItem("isAuthorized") ? <Component { ...this.props } /> : null;
		}

		componentWillMount() {
			this.checkAuth();
		}

		checkAuth() {
			var token = null;
			localStorage.setItem("isAuthorized", false);

			console.log(localStorage.getItem("token"));
			if(localStorage.getItem("token") != null) {
				token = localStorage.getItem("token");

				// Check validity of the token. If valid, authorize access to the route

				localStorage.setItem("isAuthorized", true);
			}
			
			var isAuthorized = localStorage.getItem("isAuthorized");
			if(!isAuthorized || isAuthorized == "false") {
				console.log("Not Authorized !");

				const location = this.props.location;
        		const redirect = location.pathname + location.search;

        		this.props.router.push('/?redirect=' + redirect);
			}
		}
	}

	return withRouter(AuthenticatedComponent);
}

class AppRoutes extends React.Component {
	render() {
		return (
			<Router history={browserHistory}>
				<Route path="/" component={LoginPage} />
				<Route path="/app" component={requireAuth(App)} />
				<Route path="/circleForm" component={requireAuth(CircleFormPage)} />
				<Route path="/userForm" component={requireAuth(UserFormPage)} />
				<Route path="/*" component={NotFoundPage} />
			</Router>
		);
	}
}

export default AppRoutes;