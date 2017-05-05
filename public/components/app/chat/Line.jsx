import React from 'react';
import Point from './Point.jsx';
import { API_URL, hideError, handleAPIResult, displayLoading } from '../../common/Common.jsx';
import Loading from '../../common/Loading.jsx';
import ErrorComponent from '../../common/ErrorComponent.jsx';
//import MyEditor from './MyEditor.jsx';
//import {Editor, EditorState} from 'draft-js';

class Line extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			user: null,
			points: [],
			newPoint: "",
			newPointHeight: 50,
			pointAdded: true,
			error: {
				showError: false,
				message: ""
			},
            displayLoading: false
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
    
    render() {
		return (
			<div id="div-line" className="column">
				{this.state.displayLoading && 
                	<Loading />
                }
				{this.state.error.showError &&
					<ErrorComponent message={this.state.error.message} hideError={hideError.bind(this, this)} />
				}
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

		// Define events function from SocketIO
		socket.on('new-point', function(point) {
			// If the user is on the line where it is the new point, we display it
			if(point.idLine == component.props.line.id) {
				point.created = new Date(point.created);
				var points = component.state.points;
				points.push(point);
				component.setState({
					points: points,
					pointAdded: true
				});
			} else {
				// Increase the number of unread points on the circle of the line$
				component.props.updateUnreadPoints(point.idLine);
			}
		});
        
        var user = this.getUserFromStorage();
        user.id = parseInt(user.id);
        
		this.setState({
			user: user
		});

		// Get all points of this line from DB
		this.getAllPoints();
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

	componentWillReceiveProps(nextProps) {
		this.getAllPoints(nextProps.line.id);
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

	getAllPoints(idLine) {
		var component = this;

		if(!idLine) {
			if(!this.props.line) {
				this.setState({points: []});
			} else {
				idLine = this.props.line.id;
			}
		} else if(idLine && idLine == this.props.line.id) {
			return;
		}

        //displayLoading(this);
		fetch(API_URL + 'points?idLine=' + idLine, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(points) {
			if(points) {
            	handleAPIResult(component, false, "");
				for(var i=0; i<points.length; i++) {
					points[i].created = new Date(points[i].created);
					points[i].updated = new Date(points[i].updated);
				}
				component.setState({points: points});

				component.scrollToBottom();
			} else {
            	handleAPIResult(component, true, "Une erreur est apparue lors de l'ajout du point...");
			}
		})
		.catch(function(error) {
			console.log(error);
        	handleAPIResult(component, true, "Une erreur est apparue lors de la récupération des points...");
		});
	}

	saveNewPoint(text) {
		var component = this;

        //displayLoading(this);
		fetch(API_URL + 'points', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			},
			body: JSON.stringify({
				idLine: component.props.line.id,
				idUser: component.state.user.id,
				content: text,
				created: new Date()
			})
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(point) {
            if(point) {
            	handleAPIResult(component, false, "");
                // Send the new point to the connected users
                socket.emit('new-point', point);
            } else {
            	handleAPIResult(component, true, "Une erreur est apparue lors de l'ajout du point...");
            }
		})
		.catch(function(error) {
			console.log(error);
        	handleAPIResult(component, true, "Une erreur est apparue lors de l'ajout du point...");
		});
	}

	scrollToBottom() {
		var pointsDiv = document.getElementById("points");
		pointsDiv.scrollTop = pointsDiv.scrollHeight;
	}
}

export default Line;
