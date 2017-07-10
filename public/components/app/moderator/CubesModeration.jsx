import React from 'react';
import { Link } from 'react-router';
import Point from '../chat/Point.jsx';
import { API_URL, handleAPIResult } from '../../common/Common.jsx';

class CubesModeration extends React.Component {
 
    constructor(props){
        super(props);
        
        this.state = {
			cubes: [],
            circle: this.props.circle
        }
        
        this.getAllCubes = this.getAllCubes.bind(this);
        this.deleteCube = this.deleteCube.bind(this);
    }
    
    render() {
        return (
            <div className="row">
                <table className="column medium-12 unstriped">
                    <caption>Supprimer un cube</caption>
                    <thead>
                        <tr>
                            <th>Cube</th>
                            <th>Suppression</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.cubes.map(function(cube) {
                                return (
                                    <tr key={cube.id}>
                                        <td><Point point={cube}/></td>
                                        <td><button onClick={this.deleteCube.bind(this, cube.id)} className="button">Supprimer</button></td>
                                    </tr>
                                )
                            }, this)
                        }        
                    </tbody>
                </table>
            </div>
        );
    }
    
    componentDidMount() {
        this.getAllCubes();
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.circle){
            this.setState({
               circle: nextProps.circle 
            });
            this.getAllCubes(nextProps.circle.lines[0].id);   
        }
    }
    
    getAllCubes(idLine) {
		var component = this;
        
        if(!idLine) {
			if(!this.state.circle) {
				this.setState({cubes: []});
				return;
			} else {
				idLine = this.state.circle.lines[0].id;
			}
		} else if(idLine && this.state.circle && idLine == this.state.circle.lines[0].id) {
			return;
		}
        
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
				for(var i=0; i<cubes.length; i++) {
					cubes[i].created = new Date(cubes[i].created);
					cubes[i].updated = new Date(cubes[i].updated);
				}
                
				component.setState({
                    cubes: cubes
                });

				//component.scrollToBottom();
			} else {
            	handleAPIResult(component, true, "Une erreur est apparue lors de la récupération des cubes...");
			}
		})
		.catch(function(error) {
        	handleAPIResult(component, true, "Une erreur est apparue lors de la récupération des cubes...");
		});
	}
    
    deleteCube(idCube){
        var component = this;
        
        if(!idCube) {
            return;
		}
        
		fetch(API_URL + 'cubes/' + idCube, {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});
        
        this.setState({cubes: this.state.cubes.filter(function(cube) { 
            return cube.id !== idCube 
        })});
    }
}

export default CubesModeration;