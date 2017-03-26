import React from 'react';
import Users from './Users.jsx';
import Circle from './Circle.jsx';
import {Link} from 'react-router';

class App extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id="div-app" className="expanded row">
				<div id="left-column" className="column medium-2">
					<Link to="/circleForm">Create a new circle</Link>
				</div>
                
                <Circle />
			</div>
		);
	}

	componentDidMount() {
		/*socket.on('init', function(username) {
			console.log("Receive 'init' event !!");
			console.log('Mon nom : ' + username);
		});*/
    
	}
}

export default App;
