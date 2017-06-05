import React from 'react';
import NavigatorMenu from './NavigatorMenu.jsx';
<<<<<<< HEAD
import NavigatorSearch from './NavigatorSearch.jsx';
=======
import CircleList from './CircleList.jsx';
import UserList from './UserList.jsx';
>>>>>>> f98ce7846f8ee4c13b6d160f78af230644aaadbe

class Navigator extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			circles: [],
			users: [],
			selectedCircle: null,
			error: {
				showError: false,
				message: ""
			},
            displayLoading: false,
            search: ""
		};

		this.updateUnreadPointsBadge = this.updateUnreadPointsBadge.bind(this);
		this.updateUnreadPointsCircle = this.updateUnreadPointsCircle.bind(this);
		this.updateUnreadPointsUser = this.updateUnreadPointsUser.bind(this);
		this.selectCircle = this.selectCircle.bind(this);
		this.selectUser = this.selectUser.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
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