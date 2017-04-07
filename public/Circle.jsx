import React from 'react';
import Line from './Line.jsx';

class Circle extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			circle: props.circle,
			navbarHeight: 100,
			users: [
				{
					id: 0,
					name: "Toto",
					picture: "/resource/toto.jpg"
				},
				{
					id: 1,
					name: "Lala",
					picture: "/resource/lala.png"
				}
			]
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({circle: nextProps.circle});
	}

	render() {
		return (
			<div className="column medium-10" style={{height: "100%"}}>
				<div className="expanded row" style={{height: this.state.navbarHeight + "px"}}>
					<div id="profile" className="column medium-3">
						<div className="row">
							<div className="column medium-4" style={{height: "100%"}}>
								<div className="circularImageContainer">
									<img className="profilePicture" src={this.state.circle.profilePicture}/>
								</div>
							</div>
							<div className="column medium-8" style={{height: "100%"}}>
								<h2 className="circleTitle">{this.state.circle.name}</h2>
							</div>
						</div>
					</div>
					<div id="banner" className="column medium-9">
						<img className="bannerPicture" src={this.state.circle.bannerPicture}/>
					</div>
				</div>
				<div className="row" style={{height: "calc(100% - " + this.state.navbarHeight + "px"}}>
					<Line users={this.state.users} style={{height: "100%"}}/>
					<div id="cubes" className="column medium-3">
					</div>
				</div>
			</div>
		);
	}
}
                
export default Circle;