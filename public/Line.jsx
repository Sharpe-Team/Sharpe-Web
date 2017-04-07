import React from 'react';
import Point from './Point.jsx';
//import MyEditor from './MyEditor.jsx';
//import {Editor, EditorState} from 'draft-js';

class Line extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			messages: [
				{
					id: 0,
					user: this.props.users[0],
					text: "Coucou !",
					date: new Date()
				},
				{
					id: 1,
					user: this.props.users[1],
					text: "Hey !",
					date: new Date()
				},
				{
					id: 2,
					user: this.props.users[1],
					text: "Hey !",
					date: new Date()
				},
				{
					id: 3,
					user: this.props.users[0],
					text: "Hey !",
					date: new Date()
				},
				{
					id: 4,
					user: this.props.users[1],
					text: "Hey !",
					date: new Date()
				},
				{
					id: 5,
					user: this.props.users[1],
					text: "Hey !",
					date: new Date()
				},
				{
					id: 6,
					user: this.props.users[0],
					text: "Hey !",
					date: new Date()
				},
				{
					id: 7,
					user: this.props.users[1],
					text: "Hey !",
					date: new Date()
				},
				{
					id: 8,
					user: this.props.users[0],
					text: "Hey !",
					date: new Date()
				}
			],
			newMessage: "",
			newMessageHeight: 41
		};

		// Register handler functions
		this.handleMessageChanges = this.handleMessageChanges.bind(this);
		this.handleSendAction = this.handleSendAction.bind(this);

		// Register functions
		this.getAllMessages = this.getAllMessages.bind(this);
	}
    
    // <input type="text" id="new-message" value={this.state.newMessage} onChange={this.handleMessageChanges} />

	render() {
		return (
			<div id="div-line" className="column">
				<ul id="messages" style={{height: "calc(100% - " + this.state.newMessageHeight + "px"}}>
					{
						this.state.messages.map(function(message) {
							return <Point key={message.id} {...message} />
						})
					}
				</ul>

				<form>
					<div className="row" style={{borderTop: "1px solid black", paddingTop: "0px"}}>
						<div className="column" style={{padding: 0}}>	 
                            <input type="text" id="new-message" value={this.state.newMessage} onChange={this.handleMessageChanges} />
						</div>
						<div className="column shrink">
							<button type="button" id="send-message" className="button" onClick={this.handleSendAction} > Envoyer </button>
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

export default Line;
