import React from 'react';
import Line from './Line.jsx';

class Circle extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
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
		this.getAllLines(nextProps.circle.id);
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

	getAllLines(idCircle) {
		var component = this;

		if(!idCircle) {
			idCircle = this.props.circle.id;
		}

		fetch('http://localhost:8080/lines?idCircle=' + idCircle, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(lines) {
			component.setState({
				lines: lines,
				selectedLine: (lines.length > 0) ? lines[0] : null
			});
		})
		.catch(function(error) {
			console.log(error);
			component.setState({selectedLine: null});
		});
	}
}
                
export default Circle;