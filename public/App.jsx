import React from 'react';
import Users from './Users.jsx';
import Circle from './Circle.jsx';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			navbarHeight: 50
		};
	}

	render() {
		return (
			<div id="div-app">
				<div className="row" style={{height: this.state.navbarHeight + "px"}}>
					<div className="col-md-12">
						<p>Hello World!!!</p>
					</div>
					<div className="col-md-12">
						<a href="/toto">Clique moi !!</a>
					</div>
				</div>
				<div className="row" style={{height: "calc(100% - " + this.state.navbarHeight + "px)"}}>
					<div id="left-column" className="col-md-2">
						lyfgiumjhbl
					</div>
					<Circle />
				</div>
			</div>
		);
	}

	componentDidMount() {
		/*
		socket.on('init', function(username) {
			console.log("Receive 'init' event !!");
			console.log('Mon nom : ' + username);
		});
		*/
	}
}

export default App;