import React from 'react';
import { Link, browserHistory } from 'react-router';
import { API_URL, hideError, handleAPIResult, displayLoading } from './Common.jsx';
import Loading from './Loading.jsx';
import ErrorComponent from './ErrorComponent.jsx';

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
		this.selectCircle = this.selectCircle.bind(this);
		this.resetUnreadPoints = this.resetUnreadPoints.bind(this);
		this.selectUser = this.selectUser.bind(this);
	}

	render() {
		return (
			<div id="left-column" className="column medium-2">
				{this.state.displayLoading && 
                	<Loading />
                }
				<div id="search" className="row">
					<div className="medium-1"></div>
					<Link className="medium-2" to="/userform"><img className="user-form-button" src="/resource/user.png"></img></Link>
					<div className="medium-2"></div>
					<Link className="medium-2" to="/circleform"><img className="circle-form-button" src="/resource/circle.png"></img></Link>
					<div className="medium-2"></div>
					<Link className="medium-2" to="/logout"><img className="logout-form-button" src="/resource/logout.png"></img></Link>
					<div className="medium-1"></div>
				</div>
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
						return <div key={user.id} className="row circleListItem" onClick={this.selectUser.bind(this, user)}>{user.firstname}&nbsp;{user.lastname}</div>
					})
				}
				</ul>
			</div>
		);
	}

	componentWillMount() {
		var component = this;

		this.getAllCircles();

		socket.emit('get-connected-users', function(users) {
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
		fetch(API_URL + 'circles', {
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

	resetUnreadPoints(indexCircle) {
		// Set to 0 the number of unread points to this circle
		var circles = this.state.circles;
		circles[indexCircle].nbUnreadPoints = 0;

		this.setState({
			circles: circles,
			selectedCircle: circles[indexCircle]
		});
    }

	selectCircle(circle) {
		// Find the circle that needs to be updated in the list of circles
		var indexCircle = this.state.circles.findIndex(function(element) {
			return element.id == circle.id;
		});

		this.resetUnreadPoints(indexCircle);

		this.props.updateSelectedCircle(circles[indexCircle]);
	}

	updateUnreadPointsBadge(idLine) {
		// Find the circle that need to be updated in the list of circles
		var indexCircle = this.state.circles.findIndex(function(circle) {
			return circle.lines.find(function(line) {
				return line.id == idLine;
			});
		});

		if(indexCircle >= 0) {
			var circles = this.state.circles;
			circles[indexCircle].nbUnreadPoints++;

			this.setState({
				circles: circles
			});
		} else {
			// If the circle to update is not in the list, it could be a private circle
			// TODO: get the circle for the given line id in the API
		}
	}

	selectUser(user) {
		var component = this;

		var currentUserId = parseInt(localStorage.getItem('user-id'));
		if(!currentUserId || currentUserId < 0) {
			return;
		}

		var params = "userId1=" + currentUserId + "&userId2=" + user.id;
		/*
        displayLoading(this);
		fetch(API_URL + 'circle/private?' + params, {
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

				component.setState({
					selectedCircle: circle
				});

				component.props.updateSelectedCircle(selectedCircle);
			} else {
				handleAPIResult(component, true, "Une erreur est survenue lors de la récupération du cercle privé...");
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est survenue lors de la récupération du cercle privé...");
		});
		*/
	}
}

export default Navigator;