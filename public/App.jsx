import React from 'react';
import Users from './Users.jsx';

class App extends React.Component {
	render() {
		return (
			<div>
				<p>Hello World!!!</p>
				<a href="/toto">Clique moi !!</a>
				<Users />
			</div>
		);
	}

	componentDidMount() {
		var socket = io.connect();
		socket.on('init', function(username) {
			console.log("Receive 'init' event !!");
			console.log('Mon nom : ' + username);
		});
	}
}

export default App;