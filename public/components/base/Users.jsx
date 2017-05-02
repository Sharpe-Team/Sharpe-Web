import React from 'react';

class User extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<tr>
				<td>{this.props.id}</td>
				<td>{this.props.username}</td>
				<td>{this.props.password}</td>
			</tr>
		);
	}
}

class Users extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			users: [
				{
					id: 1, 
					username: 'first', 
					password: 'password1'
				},
				{
					id: 2,
					username: 'second',
					password: 'password2'
				},
				{
					id: 3,
					username: 'third',
					password: 'password3'
				}
			],
			username: '',
			password: ''
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleUsernameChanges = this.handleUsernameChanges.bind(this);
		this.handlePasswordChanges = this.handlePasswordChanges.bind(this);

		this.updateAllUsers = this.updateAllUsers.bind(this);
		this.createUser = this.createUser.bind(this);
	}
	
	handleSubmit(event) {
		this.createUser();
		event.preventDefault();
	}

	handleUsernameChanges(event) {
		this.setState({username: event.target.value});
	}

	handlePasswordChanges(event) {
		this.setState({password: event.target.value});
	}

	updateAllUsers() {
		var component = this;

		fetch('http://localhost:8080/users', {
			method: 'GET',
			mode: 'cors'
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(users) {
			component.setState({users: users});
		})
		.catch(function(error) {
			console.log(error);
		});
	}

	createUser() {
		var component = this;

		fetch('http://localhost:8080/users', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: component.state.username,
				password: component.state.password
			})
		})
		.then(function(response) {
			return response;
		})
		.then(function(response) {
			component.updateAllUsers();
		})
		.catch(function(error) {
			console.log(error);
		});
	}

	componentDidMount() {
		this.updateAllUsers();
	}

	render() {
		return (
			<div>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Username</th>
							<th>Password</th>
						</tr>
					</thead>
					<tbody>
						{
							this.state.users.map(function(user) {
								return <User key={user.id} {...user}/>
							})
						}
					</tbody>
				</table>

				<form onSubmit={this.handleSubmit}>
					<table>
						<thead>
							<tr>
								<th>Username</th>
								<th>Password</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<input type="text" name="username" value={this.state.username} onChange={this.handleUsernameChanges} />
								</td>
								<td>
									<input type="text" name="password" value={this.state.password} onChange={this.handlePasswordChanges} />
								</td>
							</tr>
						</tbody>
					</table>
					<button type="submit" name="submitBtn">Créer</button>
				</form>
			</div>
		);
	}
}

export default Users;