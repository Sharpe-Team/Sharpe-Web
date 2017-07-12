import React from 'react';
import Circle from './Circle.jsx';
import NoCircle from './NoCircle.jsx';
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
        let circleDisplay;
        if(this.state.selectedCircle) {
            circleDisplay = (<Circle circle={this.state.selectedCircle} updateUnreadPoints={this.navigatorRef.updateUnreadPointsBadge} />);
        } else {
            circleDisplay = (<NoCircle />);
        }
        
		return (
			<div id="div-app" className="expanded row">
				<Navigator updateSelectedCircle={this.updateSelectedCircle} selectedCircle={this.state.selectedCircle} ref={ (instance) => { this.navigatorRef = instance; }} />
                {circleDisplay}
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
