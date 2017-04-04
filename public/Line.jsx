import React from 'react';
import Point from './Point.jsx';
/*
import MyEditor from './MyEditor.jsx';
*/
import {Editor, EditorState} from 'draft-js';

var socket = io.connect();

class Line extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
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
	}
    
    // <input type="text" id="new-point" value={this.state.newpoint} onChange={this.handlePointChanges} />

	render() {
		return (
			<div id="div-line" className="column">
				<ul id="points" style={{height: "calc(100% - " + this.state.newPointHeight + "px"}}>
					{
						this.state.points.map(function(point) {
							return <Point key={point.id} {...point} />
						})
					}
				</ul>

				<form onSubmit={this.handleSubmit}>
					<div className="row" style={{borderTop: "4px solid #f4f4f4", paddingTop: "5px"}}>
						<div className="column" style={{padding: 0}}>
							<input type="text" id="new-point" name="newPoint" value={this.state.newPoint} onChange={this.handleChange} />
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
		// Get all points of this line from DB
		this.getAllPoints();

		// Get the current user from the token
		//var token = localStorage.getItem('token');

		this.setState({
			user: {
				id: 1,
				email: "toto@toto.fr",
				name: "Toto"
			}
		});

		var component = this;

		// Define events function from SocketIO
		socket.on('new-point', function(point) {
			point.created = new Date(point.created);
			var points = component.state.points;
			points.push(point);
			component.setState({points: points});
			component.setState({pointAdded: true});
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

	getAllPoints() {
		var component = this;

		fetch('http://localhost:8080/points/getPointsOfCercle?line=' + this.props.idLine, {
			method: 'GET',
			mode: 'cors'
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(points) {
			component.setState({points: points});
		})
		.catch(function(error) {
			console.log(error);

			var points = [];
			for(var i=0; i<10; i++) {
				points.push(
					{
						id: i+1,
						idLine: 1,
						idUser: (i%2 == 0) ? 1 : 2,
						content: "Coucou ! " + i,
						created: new Date(),
						updated: new Date()
					}
				);
			}

			component.setState({
				points: points
			});
		});
	}

	saveNewPoint(text) {
		var component = this;

		/*
		fetch('http://localhost:8080/points/insertPointIntoCercle', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				idLine: component.props.idLine,
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
		*/

		var points = this.state.points;
		var point = {
			id: points[points.length - 1].id + 1,
			idLine: this.props.idLine,
			idUser: this.state.user.id,
			content: text,
			created: new Date()
		};
		socket.emit('new-point', point);
	}

	scrollToBottom() {
		var pointsDiv = document.getElementById("points");
		pointsDiv.scrollTop = pointsDiv.scrollHeight;
	}
}

export default Line;
