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
	}

	render() {
		return (
			<div id="div-app" className="expanded row">
				<Navigator updateSelectedCircle={this.updateSelectedCircle} />
				{ this.state.selectedCircle &&
					<Circle circle={this.state.selectedCircle} />
				}
			</div>
		);
	}

	componentWillMount() {
	}

	updateSelectedCircle(circle) {
		if(!this.state.selectedCircle || this.state.selectedCircle.id != circle.id) {
			this.setState({selectedCircle: circle});
		}
	}
}

export default App;
