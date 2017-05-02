import React from 'react';
import { Router, Route, browserHistory, withRouter } from 'react-router';
import requireAuth from '../authentification/AuthenticationComponent.jsx';
import LoginPage from '../form/LoginForm.jsx';
import LogoutComponent from '../authentification/LogoutComponent.jsx';
import App from '../../App.jsx';
import CircleFormPage from '../form/CircleForm.jsx';
import UserFormPage from '../form/UserForm.jsx';
import NotFoundPage from '../error/NotFoundPage.jsx';

class AppRoutes extends React.Component {
	render() {
		return (
			<Router history={browserHistory}>
				<Route path="/" component={LoginPage} />
				<Route path="/logout" component={requireAuth(LogoutComponent)} />
				<Route path="/app" component={requireAuth(App)} />
				<Route path="/circleForm" component={requireAuth(CircleFormPage)} />
				<Route path="/userForm" component={requireAuth(UserFormPage)} />
				<Route path="/*" component={NotFoundPage} />
			</Router>
		);
	}
}

export default AppRoutes;