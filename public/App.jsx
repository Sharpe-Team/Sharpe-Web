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
                    name: "Circle 2",
                    profilePicture: "resource/profilePicture.jpg",
                    bannerPicture: "resource/bannerPicture.jpg"
                },
                {
                    id: 3,
                    name: "Circle 3"
                },
                {
                    id: 4,
                    name: "Circle 4"
                },
                {
                    id: 5,
                    name: "Circle 5"
                },
                {
                    id: 6,
                    name: "Circle 6"
                },
                {
                    id: 7,
                    name: "Circle 7"
                },
                {
                    id: 8,
                    name: "Circle 8"
                },
                {
                    id: 9,
                    name: "Circle 9"
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
            selectedCircle: null
            
        };
        
        this.updateSelectedCircle = this.updateSelectedCircle.bind(this);
	}
    
    updateSelectedCircle(id) {
    	var newCircle = this.state.circles.find(function(element) {
    		return element.id == id;
    	});
        this.setState({selectedCircle: newCircle});
    }

	render() {
		return (
			<div id="div-app" className="expanded row">
				<Navigator updateSelectedCircle={this.updateSelectedCircle} circles={this.state.circles} users={this.state.users}/>
                <Circle circle={this.state.selectedCircle}/>
			</div>
		);
	}

	componentWillMount() {
		this.setState({selectedCircle: this.state.circles[1]});
	}
}

export default App;
