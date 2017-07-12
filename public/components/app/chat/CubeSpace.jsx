import React from 'react';
import { API_URL, hideError, handleAPIResult, getUserFromStorage } from '../../common/Common.jsx';
import CubeIcon from './CubeIcon.jsx'
import VideoChat from "./VideoChat.jsx";

class CubeSpace extends React.Component {
    constructor(props) {
        super(props);

		let userId = parseInt(localStorage.getItem("user-id"));

        this.state = {
			userId: userId,
            line: props.line,
			circle: props.circle,
            cubes: [],
			shouldDisplayVideoChat: (props.circle.type === 2 && props.circle.receiverUserId !== userId)
        };
    }
    
    render() {
        return (
            <div id="cubes" className="column medium-2">
				{ this.state.shouldDisplayVideoChat &&
					<div className="row">
						<div className="column">
							<VideoChat circle={this.props.circle} />
							<hr className="cube-space-separator"/>
						</div>
					</div>
				}

                <div className="row">
					<h3 className="cube-title">Cubes</h3>
				</div>

				<div className="row">
					<div className="column">
						<hr className="cube-space-separator"/>
						<ul className="cube-space-cubes">
							{
								this.state.cubes.map(function(object, index) {
									return (
										<li className="cube-space-item" key={index}>
											<CubeIcon cube={object}/>
											{object.url}
										</li>);
								}, this)
							}
						</ul>
					</div>
				</div>
            </div>
        )
    }
    
    componentWillMount() {
        let component = this;
        
        socket.on('new-cube', function(cube) {
			component.manageNewCube(cube);
		});

		socket.on('new-private-cube', function(cube) {
			component.manageNewCube(cube);
		});
    }

	componentDidMount() {
		this.getAllCubes(this.state.line.id);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			line: nextProps.line,
			circle: nextProps.circle,
			shouldDisplayVideoChat: (nextProps.circle.type === 2 && nextProps.circle.receiverUserId !== this.state.userId)
		});

		this.getAllCubes(nextProps.line.id);
	}
    
    manageNewCube(cube) {
		// If the user is on the line where the new point belongs to, we display it
		if (cube.idLine == this.state.line.id) {
			// Display the new point
			cube.created = new Date(cube.created);
			let cubes = this.state.cubes;
			cubes.push(cube);
			this.setState({
				cubes: cubes,
			});
		}
	}
    
    getAllCubes(idLine) {
		const component = this;

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
			} else {
				handleAPIResult(component, true, "Une erreur est apparue lors de la récupération des cubes...");
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est apparue lors de la récupération des cubes...");
		});
	}
}

export default CubeSpace;