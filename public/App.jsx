import React from 'react';
import {Link} from 'react-router';
import Circle from './Circle.jsx';

class App extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id="div-app" className="expanded row">
				<div id="left-column" className="column medium-2">
					<div className="row">
						<Link to="/circleForm">Créer un nouveau Cercle</Link>
					</div>
					<div className="row">
						<Link to="/userForm">Créer un nouvel Utilisateur</Link>
					</div>
					<div className="row">
						<Link to="/logout">Log out</Link>
					</div>
				</div>
                
                <Circle idCircle="1" />
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
