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
		return (
			<div id="div-app" className="expanded row">
				<div id="left-column" className="column medium-2">
					
				</div>
				<div id="main-content" className="column medium-10">
					<div className="expanded row" style={{height: this.state.navbarHeight + "px"}}>
						<div className="column medium-3" style={{height: "100%", border: "1px solid yellow"}}>
							
						</div>
						<div className="column medium-9" style={{height: "100%", border: "1px solid violet"}}>

						</div>
					</div>

					<div className="expanded row" style={{height: "calc(100% - " + this.state.navbarHeight + "px)"}}>
						<Circle />
						<div className="column medium-3" style={{height: "100%", border: "1px solid orange"}}>

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