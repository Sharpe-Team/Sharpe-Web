import React from 'react';
import { browserHistory } from 'react-router';

class LogoutComponent extends React.Component {

	constructor(props) {
		super(props);

		this.state = {};

	}

	componentWillMount() {

		// Remove the token in DB
		if(localStorage.getItem('token') != null) {
			fetch('http://localhost:8080/removeToken?token=' + localStorage.getItem('token'), {
				method: 'GET',
				mode: 'cors'
			})
			.then(function(response) {
				return response.json();
			})
			.then(function(response) {
				localStorage.clear();
				socket.emit('logout');
				browserHistory.push('/');
			})
			.catch(function(error) {
				localStorage.clear();
				socket.emit('logout');
				browserHistory.push('/');
			});
		}
	}

	render() {

		return (
			<div>
				You will be redirected to the Login page soon...
			</div>
		);
	}
}

export default LogoutComponent;