import React from 'react';
import Line from './Line.jsx';

class Circle extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			circle: props.circle,
			navbarHeight: 100,
			lines: [
				{
					id: 1,
					idCircle: props.circle.id,
					name: "My Line",
					announcement: "My announcement message"
				}
			],
			selectedLine: null
		};

		this.getAllLines = this.getAllLines.bind(this);
	}

	componentWillMount() {
		
		this.setState({selectedLine: this.state.lines[0]});
	}

	componentWillReceiveProps(nextProps) {
		this.setState({circle: nextProps.circle});

		this.getAllLines();
	}

	render() {
		return (
			<div className="column medium-10" style={{height: "100%"}}>
				<div className="expanded row" style={{height: this.state.navbarHeight + "px"}}>
					<div id="profile" className="column medium-3">
						<div className="row">
							<div className="column medium-4" style={{height: "100%"}}>
								<div className="circularImageContainer">
									{ this.state.circle.profilePicture &&
										<img className="profilePicture" src={this.state.circle.profilePicture}/>
									}
								</div>
							</div>
							<div className="column medium-8" style={{height: "100%"}}>
								<h2 className="circleTitle">{this.state.circle.name}</h2>
							</div>
						</div>
					</div>
					<div id="banner" className="column medium-9">
						{ this.state.circle.bannerPicture &&
							<img className="bannerPicture" src={this.state.circle.bannerPicture}/>
						}
					</div>
				</div>
				<div className="row" style={{height: "calc(100% - " + this.state.navbarHeight + "px"}}>
					<Line line={this.state.selectedLine} style={{height: "100%"}}/>
					<div id="cubes" className="column medium-3">
					</div>
				</div>
			</div>
		);
	}

	getAllLines() {


	}
}
                
export default Circle;