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
				this.circleListRef.updateUnreadPointsCircleFromPoint(point, false);
			}
		}
	}
}

export default Navigator;