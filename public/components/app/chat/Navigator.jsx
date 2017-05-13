import React from 'react';
import { Link, browserHistory } from 'react-router';
import { API_URL, hideError, handleAPIResult, displayLoading } from '../../common/Common.jsx';
import Loading from '../../common/Loading.jsx';
import ErrorComponent from '../../common/ErrorComponent.jsx';
import NavigatorMenu from './NavigatorMenu.jsx';

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
            displayLoading: false
		}

		this.getAllCircles = this.getAllCircles.bind(this);
		this.updateUnreadPointsBadge = this.updateUnreadPointsBadge.bind(this);
		this.updateUnreadPointsCircle = this.updateUnreadPointsCircle.bind(this);
		this.updateUnreadPointsUser = this.updateUnreadPointsUser.bind(this);
		this.selectCircle = this.selectCircle.bind(this);
		this.selectUser = this.selectUser.bind(this);
	}

	render() {
		return (
			<div id="left-column" className="column medium-2">
				{this.state.displayLoading && 
                	<Loading />
                }
                <NavigatorMenu/>
				
				<ul className="navigationList" style={{height: "40%"}}>
				{this.state.error.showError &&
					<ErrorComponent message={this.state.error.message} hideError={hideError.bind(this, this)} />
				}
				{
					this.state.circles.map(function(circle) {
						if(this.state.selectedCircle && this.state.selectedCircle.id == circle.id) {
							return (
								<div key={circle.id} onClick={this.selectCircle.bind(this, circle)} className="circleListItem">
									<b>{circle.name}</b>
									&nbsp;
									{ circle.nbUnreadPoints > 0 &&
										<span className="badge warning">{circle.nbUnreadPoints}</span>
									}
								</div>
							)
						}
						return (
							<div key={circle.id} onClick={this.selectCircle.bind(this, circle)} className="circleListItem" aria-describedby={"badge_" + circle.id}>
								{circle.name}
								&nbsp;
								{ circle.nbUnreadPoints > 0 &&
									<span id={"badge_" + circle.id} className="badge warning">{circle.nbUnreadPoints}</span>
								}
							</div>
						)
					}, this)
				}
				</ul>
				<hr></hr>
				<ul className="navigationList" style={{height: "40%"}}>
				{
					this.state.users.map(function(user) {
						return (
							<div key={user.id} className="row circleListItem" onClick={this.selectUser.bind(this, user)} aria-describedby={"badge_user_" + user.id}>
								{user.firstname}&nbsp;{user.lastname}
								&nbsp;
								{ user.nbUnreadPoints > 0 &&
									<span id={"badge_user_" + user.id} className="badge warning">{user.nbUnreadPoints}</span>
								}
							</div>)
					}, this)
				}
				</ul>
			</div>
		);
	}

	componentWillMount() {
		var component = this;

		this.getAllCircles();

		socket.emit('get-connected-users', function(users) {
			for(var i=0; i<users.length; i++) {
				users[i]['nbUnreadPoints'] = 0;
			}

			component.setState({
				users: users
			});
		});

		socket.on('new-connected-user', function(user) {
			var users = component.state.users;
			var userIndex = users.findIndex(function(element) {
				return element.id == user.id;
			});

			if(userIndex < 0) {
				user['nbUnreadPoints'] = 0;
				users.push(user);
				component.setState({
					users: users
				});
			}
		});

		socket.on('disconnected-user', function(disconnectedUser) {
			var updatedUsers = component.state.users.filter(function(element) {
				return element.id != disconnectedUser.id;
			});
			component.setState({
				users: updatedUsers
			});
		});
	}

	getAllCircles() {
		var component = this;

        displayLoading(this);
		fetch(API_URL + 'circles/publics', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(circles) {
			if(circles) {
				handleAPIResult(component, false, "");

				var selectedCircle = (circles.length > 0) ? circles[0] : null;

				for(var i=0; i<circles.length; i++) {
					circles[i]['nbUnreadPoints'] = 0;
				}

				component.setState({
					circles: circles,
					selectedCircle: selectedCircle
				});

				component.props.updateSelectedCircle(selectedCircle);
			} else {
				handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des cercles...");
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des cercles...");
		});
    }

	selectCircle(circle) {
		var circles = this.state.circles;

		// Find the circle that needs to be updated in the list of circles
		var indexCircle = circles.findIndex(function(element) {
			return element.id == circle.id;
		});

		this.updateUnreadPointsCircle(indexCircle, true);

		this.setState({
			selectedCircle: circles[indexCircle]
		});

		this.props.updateSelectedCircle(circles[indexCircle]);
	}

	updateUnreadPointsBadge(point, isPrivate) {
		if(isPrivate) {
			this.updateUnreadPointsUser(point.user.id, false);
		} else {
			// Find the circle that needs to be updated in the list of circles
			var indexCircle = this.state.circles.findIndex(function(circle) {
				return circle.lines.find(function(line) {
					return line.id == point.idLine;
				});
			});
			this.updateUnreadPointsCircle(indexCircle, false);
		}
	}

	updateUnreadPointsCircle(indexCircle, defaultValue) {
		if(indexCircle >= 0) {
			var circles = this.state.circles;

			if(defaultValue) {
				circles[indexCircle].nbUnreadPoints = 0;
			} else {
				circles[indexCircle].nbUnreadPoints++;
			}

			this.setState({
				circles: circles
			});
		}
	}

	updateUnreadPointsUser(userId, defaultValue) {
		var indexUser = this.state.users.findIndex(function(user) {
			return user.id == userId;
		});

		if(indexUser >= 0) {
			var users = this.state.users;

			if(defaultValue) {
				users[indexUser].nbUnreadPoints = 0;
			} else {
				users[indexUser].nbUnreadPoints++;
			}

			this.setState({
				users: users
			});
		}
	}

	selectUser(user) {
		var component = this;

		var currentUserId = parseInt(localStorage.getItem('user-id'));
		if(!currentUserId 
			|| currentUserId < 0 
			|| this.state.selectedCircle.receiverUserId == user.id) {
			return;
		}

		var params = "idUser1=" + currentUserId + "&idUser2=" + user.id;
		
        displayLoading(this);
		fetch(API_URL + 'circles/private?' + params, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(circle) {
			if(circle) {
				handleAPIResult(component, false, "");

				circle['nbUnreadPoints'] = 0;
				circle['receiverUserId'] = user.id;

				component.updateUnreadPointsUser(user.id, true);

				component.setState({
					selectedCircle: circle
				});

				component.props.updateSelectedCircle(circle);
			} else {
				handleAPIResult(component, true, "Une erreur est survenue lors de la récupération du cercle privé...");
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est survenue lors de la récupération du cercle privé...");
		});
	}
}

export default Navigator;