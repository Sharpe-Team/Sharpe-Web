import React from 'react';
import Users from './Users.jsx';
import Circle from './Circle.jsx';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			navbarHeight: 100
		};
	}

	render() {
		/*
		return (
			<div id="div-app">
				<div className="row" style={{height: this.state.navbarHeight + "px"}}>
					<div className="col-md-12 bordered">
						<p>Hello World!!!</p>
					</div>
					<div className="col-md-12 bordered">
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
		);*/

		return (
			<div id="div-app">
				<div id="left-column" className="col-md-2">
					
				</div>
				<div id="main-content" className="col-md-10">
					<div className="row" style={{height: this.state.navbarHeight + "px"}}>
						<div className="col-md-2" style={{height: "100%", border: "1px solid yellow"}}>
							
						</div>
						<div className="col-md-10" style={{height: "100%", border: "1px solid violet"}}>

						</div>
					</div>

					<div className="row" style={{height: "calc(100% - " + this.state.navbarHeight + "px)"}}>
						<Circle />
						<div className="col-md-3" style={{height: "100%", border: "1px solid orange"}}>

						</div>
					</div>
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