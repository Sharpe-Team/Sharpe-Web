import React from 'react';
import NavigatorMenu from './NavigatorMenu.jsx';
import NavigatorSearch from './NavigatorSearch.jsx';
import CircleList from './CircleList.jsx';
import UserList from './UserList.jsx';

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
        this.searchHandler = this.searchHandler.bind(this);
	}

	render() {
		return (
			<div id="left-column" className="column medium-2">
                <NavigatorMenu/>
                <hr/>
                <NavigatorSearch action={this.searchHandler}/>
				<CircleList search={this.state.search} updateSelectedCircle={this.props.updateSelectedCircle} selectedCircle={this.props.selectedCircle} ref={ (instance) => { this.circleListRef = instance; }}/>
				<hr/>
				<UserList search={this.state.search} updateSelectedCircle={this.props.updateSelectedCircle} selectedCircle={this.props.selectedCircle} ref={ (instance) => { this.userListRef = instance; }}/>
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
    
    searchHandler(search){
        this.setState({
            search: search
        });
    }
}

export default Navigator;