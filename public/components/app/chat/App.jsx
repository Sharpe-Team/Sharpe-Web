import React from 'react';
import Circle from './Circle.jsx';
import Navigator from './Navigator.jsx';

class App extends React.Component {

	constructor(props) {
		super(props);
        
		this.state = {
			selectedCircle: null
		};

		this.updateSelectedCircle = this.updateSelectedCircle.bind(this);
	}

	render() {
		return (
			<div id="div-app" className="expanded row">
				<Navigator updateSelectedCircle={this.updateSelectedCircle} selectedCircle={this.state.selectedCircle} ref={ (instance) => { this.navigatorRef = instance; }} />
				{ this.state.selectedCircle &&
					<Circle circle={this.state.selectedCircle} updateUnreadPoints={this.navigatorRef.updateUnreadPointsBadge} />
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
}

export default App;
