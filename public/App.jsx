import React from 'react';
import {Link} from 'react-router';
import Circle from './Circle.jsx';
import Navigator from './Navigator.jsx';

class App extends React.Component {

	constructor(props) {
		super(props);
        
		this.state = {
			selectedCircle: null
		};

		this.updateSelectedCircle = this.updateSelectedCircle.bind(this);
		this.updateUnreadPoints = this.updateUnreadPoints.bind(this);
	}

	render() {
		return (
			<div id="div-app" className="expanded row">
				<Navigator updateSelectedCircle={this.updateSelectedCircle} ref={ (instance) => { this.navigatorRef = instance; }} />
				{ this.state.selectedCircle &&
					<Circle circle={this.state.selectedCircle} updateUnreadPoints={this.updateUnreadPoints} />
				}
			</div>
		);
	}

	componentWillMount() {
	}
    
	updateSelectedCircle(circle) {
		if(circle && (!this.state.selectedCircle || this.state.selectedCircle.id != circle.id)) {
			circle.nbUnreadPoints = 0;
			this.setState({selectedCircle: circle});
		}
	}

	updateUnreadPoints(point, isPrivate) {
        if(this.navigatorRef) {
		  this.navigatorRef.updateUnreadPointsBadge(point, isPrivate);
        }
	}
}

export default App;
