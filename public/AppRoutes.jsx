import React from 'react';
import { Router, Route, browserHistory, withRouter } from 'react-router';
import requireAuth from './components/authentication/AuthenticationComponent.jsx';
import LoginPage from './components/authentication/LoginForm.jsx';
import LogoutComponent from './components/authentication/LogoutComponent.jsx';
import App from './components/app/chat/App.jsx';
import CircleFormPage from './components/app/manage/CircleForm.jsx';
import UserFormPage from './components/app/manage/UserForm.jsx';
import NotFoundPage from './components/common/NotFoundPage.jsx';

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