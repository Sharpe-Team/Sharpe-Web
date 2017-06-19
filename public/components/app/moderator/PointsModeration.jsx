import React from 'react';
import { Link } from 'react-router';
import Point from '../chat/Point.jsx';
import { API_URL, handleAPIResult } from '../../common/Common.jsx';

class PointsModeration extends React.Component {
 
    constructor(props){
        super(props);
        
        this.state = {
			points: [],
            circle: this.props.circle
        }
        
        this.getAllPoints = this.getAllPoints.bind(this);
        this.deletePoint = this.deletePoint.bind(this);
    }
    
    render() {
        return (
            <div className="row">
                <table className="column medium-12 unstriped">
                    <caption>Supprimer un point</caption>
                    <thead>
                        <tr>
                            <th>Point</th>
                            <th>Suppression</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.points.map(function(point) {
                                return (
                                    <tr key={point.id}>
                                        <td><Point point={point}/></td>
                                        <td><button onClick={this.deletePoint.bind(this, point.id)} className="button">Supprimer</button></td>
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
        this.getAllPoints();
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.circle){
            this.setState({
               circle: nextProps.circle 
            });
            this.getAllPoints(nextProps.circle.lines[0].id);   
        }
    }
    
    getAllPoints(idLine) {
		var component = this;
        
        if(!idLine) {
			if(!this.state.circle) {
				this.setState({points: []});
				return;
			} else {
				idLine = this.state.circle.lines[0].id;
			}
		} else if(idLine && this.state.circle && idLine == this.state.circle.lines[0].id) {
			return;
		}
        
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
                
				component.setState({
                    points: points
                });

				//component.scrollToBottom();
			} else {
            	handleAPIResult(component, true, "Une erreur est apparue lors de la récupération des points...");
			}
		})
		.catch(function(error) {
        	handleAPIResult(component, true, "Une erreur est apparue lors de la récupération des points...");
		});
	}
    
    deletePoint(idPoint){
        var component = this;
        
        if(!idPoint) {
            return;
		}
        
		fetch(API_URL + 'points/' + idPoint, {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});
    }
}

export default PointsModeration;