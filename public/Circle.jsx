import React from 'react';
import Line from './Line.jsx';

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
			line = (<Line line={this.state.selectedLine} circle={this.props.circle} updateUnreadPoints={this.props.updateUnreadPoints} style={{height: "100%"}}/>);
		} else {
			line = (
				<div id="div-line" className="column">
					<h3>Aucune ligne existante pour le cercle selectionné...</h3>
				</div>
			);
		}

		return (
			<div className="column medium-10" style={{height: "100%"}}>
				<div className="expanded row" style={{height: this.state.navbarHeight + "px"}}>
					<div id="profile" className="column medium-6">
						<div className="row">
							<div className="column medium-3" style={{height: "100%"}}>
								<div className="circularImageContainer">
									{ this.props.circle.pictureUrl &&
										<img className="profilePicture" src={'uploads/' + this.props.circle.pictureUrl}/>
									}
								</div>
							</div>
							<div className="column medium-9" style={{height: "100%"}}>
								<h2 className="circleTitle">{this.props.circle.name}</h2>
							</div>
						</div>
					</div>
					<div id="banner" className="column medium-6">
						{ this.props.circle.bannerPictureUrl &&
							<img className="bannerPicture" src={'uploads/' + this.props.circle.bannerPictureUrl}/>
						}
					</div>
				</div>
				<div className="row" style={{height: "calc(100% - " + this.state.navbarHeight + "px"}}>
					{line}
					<div id="cubes" className="column medium-3">
					</div>
				</div>
			</div>
		);
	}
}
                
export default Circle;