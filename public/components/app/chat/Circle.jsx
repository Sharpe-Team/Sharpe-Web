import React from 'react';
import Line from './Line.jsx';
import CircleHeader from './CircleHeader.jsx';

class Circle extends React.Component {

	constructor(props) {
		super(props);

		var selectedLine = null;

		if(props.circle 
			&& props.circle.lines 
			&& props.circle.lines.length > 0) {
			selectedLine = props.circle.lines[0];
		}

		this.state = {
			navbarHeight: 100,
			selectedLine: selectedLine
		};
	}

	componentWillMount() {
	}

	componentWillReceiveProps(nextProps) {
		var selectedLine = null;

		if(nextProps.circle 
			&& nextProps.circle.lines 
			&& nextProps.circle.lines.length > 0) {
			selectedLine = nextProps.circle.lines[0];
		}

		this.setState({
			selectedLine: selectedLine
		});
	}

	render() {
		var line;
		if(this.state.selectedLine) {
			line = (<Line line={this.state.selectedLine} updateUnreadPoints={this.props.updateUnreadPoints} style={{height: "100%"}}/>);
		} else {
			line = (
				<div id="div-line" className="column">
					<h3>Aucune ligne existante pour le cercle selectionné...</h3>
				</div>
			);
		}

		return (
			<div className="column medium-10" style={{height: "100%"}}>
				<CircleHeader circle={this.props.circle} navbarHeight={this.state.navbarHeight}/>
				<div className="row" style={{height: "calc(100% - " + this.state.navbarHeight + "px"}}>
					{line}
					<div id="cubes" className="column medium-2">
					</div>
				</div>
			</div>
		);
	}
}
                
export default Circle;