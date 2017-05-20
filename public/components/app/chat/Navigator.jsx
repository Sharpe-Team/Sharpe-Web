import React from 'react';
import NavigatorMenu from './NavigatorMenu.jsx';
import CircleList from './CircleList.jsx';
import UserList from './UserList.jsx';

class Navigator extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
		};

		this.updateUnreadPointsBadge = this.updateUnreadPointsBadge.bind(this);
	}

	render() {
		return (
			<div id="left-column" className="column medium-2">
                <NavigatorMenu/>
				<hr/>
				<CircleList updateSelectedCircle={this.props.updateSelectedCircle} selectedCircle={this.props.selectedCircle} ref={ (instance) => { this.circleListRef = instance; }}/>
				<hr/>
				<UserList updateSelectedCircle={this.props.updateSelectedCircle} selectedCircle={this.props.selectedCircle} ref={ (instance) => { this.userListRef = instance; }}/>
			</div>
		);
	}

	componentWillMount() {
	}

	updateUnreadPointsBadge(point, isPrivate) {
		if(isPrivate) {
			this.userListRef.updateUnreadPointsUser(point.user.id, false);
		} else {
			if(this.circleListRef) {
				// Find the circle that needs to be updated in the list of circles
				let indexCircle = this.circleListRef.state.circles.findIndex(function(circle) {
					return circle.lines.find(function(line) {
						return line.id == point.idLine;
					});
				});

				this.circleListRef.updateUnreadPointsCircle(indexCircle, false);
			}
		}
	}


}

export default Navigator;