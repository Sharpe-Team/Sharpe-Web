import React from 'react';
import { Router, Route, browserHistory, withRouter } from 'react-router';
import requireAuth from './components/authentication/AuthenticationComponent.jsx';
import LoginPage from './components/authentication/LoginForm.jsx';
import LogoutComponent from './components/authentication/LogoutComponent.jsx';
import App from './components/app/chat/App.jsx';
import CircleSearcher from './components/app/chat/CircleSearcher.jsx';
import Admin from './components/app/admin/Admin.jsx';
import CircleFormPage from './components/app/manage/CircleForm.jsx';
import UserFormPage from './components/app/manage/UserForm.jsx';
import NotFoundPage from './components/common/NotFoundPage.jsx';
import NotAuthorizedPage from './components/common/NotAuthorizedPage.jsx';
import Moderation from './components/app/moderator/Moderation.jsx';
import { userType } from './components/common/Common.jsx';

class AppRoutes extends React.Component {
	render() {
		return (
			<Router history={browserHistory}>
				<Route path="/" component={LoginPage} />
                <Route path="/notAuthorized" component={NotAuthorizedPage} />
				<Route path="/logout" component={requireAuth(LogoutComponent, userType.user)} />
				<Route path="/app" component={requireAuth(App, userType.user)} />
				<Route path="/circleForm" component={requireAuth(CircleFormPage, userType.user)} />
				<Route path="/userForm" component={requireAuth(UserFormPage, userType.admin)} />
                <Route path="/admin" component={requireAuth(Admin, userType.admin)} />
                <Route path="/moderation/:circleId" component={requireAuth(Moderation, userType.user, true)} />
                <Route path="/circlesearch" component={requireAuth(CircleSearcher, userType.user)} />
				<Route path="/*" component={NotFoundPage} />
			</Router>
		);
	}
}

export default AppRoutes;