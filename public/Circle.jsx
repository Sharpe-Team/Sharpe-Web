import React from 'react';
import Line from './Line.jsx';

class Circle extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			circle: props.circle,
			navbarHeight: 100,
			lines: [],
			selectedLine:  null
		};

		this.getAllLines = this.getAllLines.bind(this);
	}

	componentWillMount() {
		
		this.getAllLines();
	}

	componentWillReceiveProps(nextProps) {
		this.setState({circle: nextProps.circle});

		this.getAllLines();
	}

	render() {

		var line;
		if(this.state.selectedLine) {
			line = (<Line line={this.state.selectedLine} style={{height: "100%"}}/>);
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
									{ this.state.circle.pictureUrl &&
										<img className="profilePicture" src={'uploads/' + this.state.circle.pictureUrl}/>
									}
								</div>
							</div>
							<div className="column medium-9" style={{height: "100%"}}>
								<h2 className="circleTitle">{this.state.circle.name}</h2>
							</div>
						</div>
					</div>
					<div id="banner" className="column medium-6">
						{ this.state.circle.bannerPictureUrl &&
							<img className="bannerPicture" src={'uploads/' + this.state.circle.bannerPictureUrl}/>
						}
					</div>
				</div>
				<div className="row" style={{height: "calc(100% - " + this.state.navbarHeight + "px"}}>
					{ line }
					<div id="cubes" className="column medium-3">
					</div>
				</div>
			</div>
		);
	}

	getAllLines() {
		var component = this;

		fetch('http://localhost:8080/lines?idCircle=' + this.state.circle.id, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(lines) {
			component.setState({lines: lines});

			if(lines.length > 0) {
				component.setState({selectedLine: lines[0]});
			}
		})
		.catch(function(error) {
			console.log(error);
			component.setState({selectedLine: null});
		});
	}
}
                
export default Circle;