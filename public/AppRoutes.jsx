import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import App from './App.jsx';
import CircleFormPage from './CircleForm.jsx';
import NotFoundPage from './NotFoundPage.jsx';

class AppRoutes extends React.Component {
	render() {
		return (
			<Router history={browserHistory}>
				<Route path="/" component={App}/>
				<Route path="/circleForm" component={CircleFormPage}/>
				<Route path="/*" component={NotFoundPage}/>
			</Router>
		);
	}
}

export default AppRoutes;