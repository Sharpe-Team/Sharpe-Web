import React from 'react';
import Point from './Point.jsx';
import { API_URL, hideError, handleAPIResult, getUserFromStorage } from '../../common/Common.jsx';
import Loading from '../../common/Loading.jsx';
import ErrorComponent from '../../common/ErrorComponent.jsx';
import InsertImageItem from './InsertImageItem.jsx';
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
            displayLoading: false,
			cubes: [],
			concatArray: []
		};

		// Register handler functions
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		// Register functions
		this.manageNewPoint = this.manageNewPoint.bind(this);
		this.manageNewCube = this.manageNewCube.bind(this);
		this.getAllPoints = this.getAllPoints.bind(this);
		this.getAllCubes = this.getAllCubes.bind(this);
		this.saveNewPoint = this.saveNewPoint.bind(this);
		this.scrollToBottom = this.scrollToBottom.bind(this);
		this.updateState = this.updateState.bind(this);
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

					{
						this.state.cubes.map(function(cube) {
							return <Point key={cube.id} point={cube} />
						}, this)
					}
				</ul>

				<form onSubmit={this.handleSubmit}>
					<div className="row" style={{borderTop: "4px solid #f4f4f4", paddingTop: "5px"}}>
						<div className="column shrink">
							<InsertImageItem circle={this.props.circle} idLine={this.props.line.id} idUser={this.state.user.id} updateParentState={this.updateState} />
						</div>
						<div className="column" style={{padding: "1px"}}>
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
		const component = this;

		// Define events function from SocketIO
		socket.on('new-point', function(point) {
			component.manageNewPoint(point, false);
		});

		socket.on('new-private-point', function(point) {
			component.manageNewPoint(point, true);
		});

		socket.on('new-cube', function(cube) {
			component.manageNewCube(cube, false);
		});

		socket.on('new-private-cube', function(cube) {
			component.manageNewCube(cube, true);
		});
        
        let user = getUserFromStorage();
		this.setState({
			user: user
		});

		// Get all points and cubes of this line from DB
		this.getAllPoints();
		this.getAllCubes();
	}

	componentDidMount() {
	}

	componentDidUpdate() {
		if(this.state.pointAdded) {
			this.scrollToBottom();
			this.setState({pointAdded: false});
		}
	}

	componentWillReceiveProps(nextProps) {
		this.getAllPoints(nextProps.line.id);
		this.getAllCubes(nextProps.line.id);
	}

	/************************************************
	*				HANDLER FUNCTIONS 				*
	*************************************************/

	handleChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();

		let text = this.state.newPoint.trim();
		this.state.newPoint = "";

		if(text.length !== 0) {
			this.saveNewPoint(text);
		}
	}

	/************************************************
	*					FUNCTIONS 					*
	*************************************************/

	manageNewPoint(point, isPrivate) {
		// If the user is on the line where the new point belongs to, we display it
		if(point.idLine == this.props.line.id) {
			// Display the new point
			point.created = new Date(point.created);
			let points = this.state.points;
			points.push(point);
			this.setState({
				points: points,
				pointAdded: true
			});
		} else {
			// Increase the number of unread points on the circle of the line$
			this.props.updateUnreadPoints(point, isPrivate);
		}
	}

	manageNewCube(cube, isPrivate) {
		// If the user is on the line where the new cube belongs to, we display it
		if(cube.idLine == this.props.line.id) {
			// Display the new cube
			cube.created = new Date(cube.created);
			let cubes = this.state.cubes;
			cubes.push(cube);
			this.setState({
				cubes: cubes,
				pointAdded: true
			});
		} else {
			// Increase the number of unread points on the circle of the line$
			this.props.updateUnreadPoints(cube, isPrivate);
		}
	}

	getAllPoints(idLine) {
		const component = this;

		if(!idLine) {
			if(!this.props.line) {
				this.setState({points: []});
				return;
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
				for(let i=0; i<points.length; i++) {
					points[i].created = new Date(points[i].created);
					points[i].updated = new Date(points[i].updated);
				}
				component.setState({points: points});
				component.scrollToBottom();
			} else {
            	handleAPIResult(component, true, "Une erreur est apparue lors de la récupération des points...");
			}
		})
		.catch(function(error) {
			console.log(error);
        	handleAPIResult(component, true, "Une erreur est apparue lors de la récupération des points...");
		});
	}

	getAllCubes(idLine) {
		const component = this;

		if(!idLine) {
			if(!this.props.line) {
				this.setState({cubes: []});
				return;
			} else {
				idLine = this.props.line.id;
			}
		} else if(idLine && idLine == this.props.line.id) {
			return;
		}

		//displayLoading(this);
		fetch(API_URL + 'cubes?line_id=' + idLine, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(cubes) {
			if(cubes) {
				handleAPIResult(component, false, "");

				for(let i=0; i<cubes.length; i++) {
					cubes[i].created = new Date(cubes[i].created);
					cubes[i].updated = new Date(cubes[i].updated);
				}
				component.setState({cubes: cubes});
				component.scrollToBottom();
			} else {
				handleAPIResult(component, true, "Une erreur est apparue lors de la récupération des cubes...");
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est apparue lors de la récupération des cubes...");
		});
	}

	saveNewPoint(text) {
		const component = this;

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

            	if(component.props.circle.type == 2) {
            		// Send a private point to the receiver user
            		socket.emit('new-private-point', point, component.props.circle.receiverUserId);
            	} else {
                	// Send the new point to the connected users
                	socket.emit('new-point', point);
            	}
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
		const pointsDiv = document.getElementById("points");
		pointsDiv.scrollTop = pointsDiv.scrollHeight;
	}

	updateState(error, displayLoading) {
		this.setState({
			error: error,
			displayLoading: displayLoading
		});
	}
}

export default Line;
