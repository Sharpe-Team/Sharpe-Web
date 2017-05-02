import React from 'react';
import {Link} from 'react-router';
import Circle from './components/base/Circle.jsx';
import Navigator from './components/navigator/Navigator.jsx';

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

	updateUnreadPoints(idLine) {
        if(this.navigatorRef) {
		  this.navigatorRef.updateUnreadPointsBadge(idLine);
        }
	}
}

export default App;
