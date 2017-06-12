import React from 'react';
import { API_URL, hideError, handleAPIResult, displayLoading } from '../../common/Common.jsx';
import Loading from '../../common/Loading.jsx';
import ErrorComponent from '../../common/ErrorComponent.jsx';

class UserList extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			users: [],
			error: {
				showError: false,
				message: ""
			},
			displayLoading: false
		};

		this.updateUnreadPointsUser = this.updateUnreadPointsUser.bind(this);
		this.selectUser = this.selectUser.bind(this);
	}

	render() {
		return (
			<div>
				{this.state.displayLoading &&
					<Loading />
				}
				{this.state.error.showError &&
					<ErrorComponent message={this.state.error.message} hideError={hideError.bind(this, this)} />
				}
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

	componentDidMount() {
		let component = this;

		socket.emit('get-connected-users', function(users) {
			for(let i=0; i<users.length; i++) {
				users[i]['nbUnreadPoints'] = 0;
			}

			component.setState({
				users: users
			});
		});

		socket.on('new-connected-user', function(user) {
			let users = component.state.users;
			let userIndex = users.findIndex(function(element) {
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
			let updatedUsers = component.state.users.filter(function(element) {
				return element.id != disconnectedUser.id;
			});
			component.setState({
				users: updatedUsers
			});
		});
	}

	updateUnreadPointsUser(userId, defaultValue) {
		let indexUser = this.state.users.findIndex(function(user) {
			return user.id == userId;
		});

		if(indexUser >= 0) {
			let users = this.state.users;

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
		let component = this;

		let currentUserId = parseInt(localStorage.getItem('user-id'));
		if(!currentUserId
			|| currentUserId < 0
			|| (this.props.selectedCircle && this.props.selectedCircle.receiverUserId == user.id)) {
			return;
		}

		let params = "idUser1=" + currentUserId + "&idUser2=" + user.id;

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

export default UserList;