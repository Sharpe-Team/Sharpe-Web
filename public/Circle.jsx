import React from 'react';
import Point from './Point.jsx';

class Circle extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			messages: [
				{
					id: 0,
					user: "Toto",
					text: "Coucou !",
					date: new Date()
				},
				{
					id: 1,
					user: "Lala",
					text: "Hey !",
					date: new Date()
				},
				{
					id: 2,
					user: "Lala",
					text: "Hey !",
					date: new Date()
				},
				{
					id: 3,
					user: "Lala",
					text: "Hey !",
					date: new Date()
				},
				{
					id: 4,
					user: "Lala",
					text: "Hey !",
					date: new Date()
				},
				{
					id: 5,
					user: "Lala",
					text: "Hey !",
					date: new Date()
				},
				{
					id: 6,
					user: "Lala",
					text: "Hey !",
					date: new Date()
				},
				{
					id: 7,
					user: "Lala",
					text: "Hey !",
					date: new Date()
				},
				{
					id: 8,
					user: "Lala",
					text: "Hey !",
					date: new Date()
				},
				{
					id: 9,
					user: "Lala",
					text: "Hey !",
					date: new Date()
				}
			],
			newMessage: "",
			newMessageHeight: 60
		};

		// Register handler functions
		this.handleMessageChanges = this.handleMessageChanges.bind(this);
		this.handleSendAction = this.handleSendAction.bind(this);

		// Register functions
		this.getAllMessages = this.getAllMessages.bind(this);
	}

	render() {
		return (
			<div id="div-circle" className="col-md-9">
				<ul id="messages" className="list-unstyled" style={{height: "calc(100% - " + this.state.newMessageHeight + "px"}}>
					{
						this.state.messages.map(function(message) {
							return <Point key={message.id} {...message} />
						})
					}
				</ul>

				<form>
					<div className="form-group" style={{borderTop: "1px solid black", paddingTop: "5px"}}>
						<div style={{padding: "0px", width: "calc(100% - 90px)"}}>
							<input type="text" id="new-message" className="form-control" value={this.state.newMessage} onChange={this.handleMessageChanges} />
						</div>
						<div style={{padding: "0px", width: "77px"}}>
							<button type="button" id="send-message" className="btn btn-primary" onClick={this.handleSendAction} > Envoyer </button>
						</div>
					</div>
				</form>
			</div>
		);
	}

	componentDidMount() {
		//this.getAllMessages();
	}

	/************************************************
	*				HANDLER FUNCTIONS 				*
	*************************************************/

	handleMessageChanges(event) {
		this.setState({newMessage: event.target.value});
	}

	handleSendAction(event) {

		var messages = this.state.messages;
		var id = messages[messages.length - 1].id + 1;
		var message = {
			id: id,
			user: "Moi",
			text: this.state.newMessage.trim(),
			date: new Date()
		};

		this.state.newMessage = "";

		if(message.text.length !== 0) {
			//socket.emit('new-message', message);
			messages.push(message);
			this.setState({messages: messages});
		}
	}

	/************************************************
	*					FUNCTIONS 					*
	*************************************************/

	getAllMessages() {
		var component = this;

		fetch('http://localhost:8080/messages', {
			method: 'GET',
			mode: 'cors'
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(messages) {
			component.setState({messages: messages});
		})
		.catch(function(error) {
			console.log(error);
		});
	}
}

export default Circle;
