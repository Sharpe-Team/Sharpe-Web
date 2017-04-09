import React from 'react';
import Point from './Point.jsx';
//import MyEditor from './MyEditor.jsx';
//import {Editor, EditorState} from 'draft-js';

class Line extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			user: null,
			line: props.line,
			points: [],
			newPoint: "",
			newPointHeight: 50,
			pointAdded: true
		};

		// Register handler functions
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		// Register functions
		this.getAllPoints = this.getAllPoints.bind(this);
		this.saveNewPoint = this.saveNewPoint.bind(this);
		this.scrollToBottom = this.scrollToBottom.bind(this);
		this.getUserFromStorage = this.getUserFromStorage.bind(this);
	}
    
    // <input type="text" id="new-point" value={this.state.newpoint} onChange={this.handlePointChanges} />

	render() {
		return (
			<div id="div-line" className="column">
				<ul id="points" style={{height: "calc(100% - " + this.state.newPointHeight + "px"}}>
					{
						this.state.points.map(function(point) {
							return <Point key={point.id} point={point} />
						}, this)
					}
				</ul>

				<form onSubmit={this.handleSubmit}>
					<div className="row" style={{borderTop: "4px solid #f4f4f4", paddingTop: "5px"}}>
						<div className="column" style={{padding: 0}}>
							<input type="text" id="new-point" name="newPoint" value={this.state.newPoint} onChange={this.handleChange} autoComplete="off" placeholder="Ecrivez un message..." />
						</div>
						<div className="column shrink">
							<button type="submit" id="send-point" className="button"> Envoyer </button>
						</div>
					</div>
				</form>
			</div>
		);
	}

	componentWillMount() {

		var component = this;

		this.setState({
			user: component.getUserFromStorage()
		});

		// Get all points of this line from DB
		this.getAllPoints();

		// Define events function from SocketIO
		socket.on('new-point', function(point) {
			point.created = new Date(point.created);
			var points = component.state.points;
			points.push(point);
			component.setState({
				points: points,
				pointAdded: true
			});
		});
	}

	componentDidMount() {

		this.scrollToBottom();
	}

	componentDidUpdate() {
		if(this.state.pointAdded) {
			this.scrollToBottom();
			this.setState({pointAdded: false});
		}
	}

	/************************************************
	*				HANDLER FUNCTIONS 				*
	*************************************************/

	handleChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();

		var points = this.state.points;
		var text = this.state.newPoint.trim();

		this.state.newPoint = "";

		if(text.length !== 0) {
			this.saveNewPoint(text);
		}
	}

	/************************************************
	*					FUNCTIONS 					*
	*************************************************/

	getUserFromStorage() {
		return {
			id: localStorage.getItem('user-id'),
			firstname: localStorage.getItem('user-firstname'),
			lastname: localStorage.getItem('user-lastname'),
			email: localStorage.getItem('user-email'),
			profilePicture: localStorage.getItem('user-profile-picture')
		}
	}

	getAllPoints() {
		var component = this;

		fetch('http://localhost:8080/points?idLine=' + this.state.line.id, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(points) {
			for(var i=0; i<points.length; i++) {
				points[i].created = new Date(points[i].created);
				points[i].updated = new Date(points[i].updated);
			}
			component.setState({points: points});
		})
		.catch(function(error) {
			console.log(error);
		});
	}

	saveNewPoint(text) {
		var component = this;

		fetch('http://localhost:8080/points', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			},
			body: JSON.stringify({
				idLine: component.state.line.id,
				idUser: component.state.user.id,
				content: text,
				created: new Date()
			})
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(point) {
			// Send the new point to the connected users
			socket.emit('new-point', point);
		})
		.catch(function(error) {
			console.log(error);
		});
	}

	scrollToBottom() {
		var pointsDiv = document.getElementById("points");
		pointsDiv.scrollTop = pointsDiv.scrollHeight;
	}
}

export default Line;
