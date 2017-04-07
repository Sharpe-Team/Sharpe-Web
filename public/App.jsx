import React from 'react';
import Users from './Users.jsx';
import Circle from './Circle.jsx';
import Navigator from './Navigator.jsx';

class App extends React.Component {

	constructor(props) {
		super(props);
        
        this.state = {
            circles: [
                {
                    id: 1,
                    name: "Circle 1"
                },
                {
                    id: 2,
                    name: "Circle 2"
                },
                {
                    id: 3,
                    name: "Circle 3"
                },{
                    id: 4,
                    name: "Circle 1"
                },
                {
                    id: 5,
                    name: "Circle 2"
                },
                {
                    id: 6,
                    name: "Circle 3"
                },{
                    id: 7,
                    name: "Circle 1"
                },
                {
                    id: 8,
                    name: "Circle 2"
                },
                {
                    id: 9,
                    name: "Circle 3"
                }
            ],
            users: [
                {
                    id: 1,
                    name: "User 1"
                },
                {
                    id: 2,
                    name: "User 2"
                },
                {
                    id: 3,
                    name: "User 3"
                }
            ],
            selectedCircle: {
                    id: 2,
                    name: "Circle 2",
                    profilePicture: "resource/profilePicture.jpg",
                    bannerPicture: "resource/bannerPicture.jpg"
            }
        };
	}

	render() {
		return (
			<div id="div-app" className="expanded row">
				<Navigator circles={this.state.circles} users={this.state.users}/>
                <Circle circle={this.state.selectedCircle}/>
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
