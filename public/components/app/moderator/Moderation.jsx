import React from 'react';
import { Link } from 'react-router';
import { API_URL, handleAPIResult } from '../../common/Common.jsx';
import PointsModeration from './PointsModeration.jsx';
import ModeratorsModeration from './ModeratorsModeration.jsx';

const selection = {
    point : 0,
    request : 1,
    moderator : 2
}

class Moderation extends React.Component {

    constructor(props){
        super(props);
        
        this.state = {
            selected: selection.point,
            circle: null
        }
        
        this.changeElement = this.changeElement.bind(this);
        this.getCircle = this.getCircle.bind(this);
    }
    
    render() {
        return (
            <div className="moderation-page">
                <div className="moderation-menu-bar">
                    <Link to="/app"><img className="home-button" src="/resource/home-button.png"/></Link>
                    <button onClick={this.changeElement.bind(this, selection.point)}>
                        <img className="point-button" src="/resource/point-button.png"/>
                    </button>
                    <button onClick={this.changeElement.bind(this, selection.request)}>
                        <img className="request-button" src="/resource/request-button.png"/>
                    </button>
                    <button onClick={this.changeElement.bind(this, selection.moderator)}>
                        <img className="moderator-button" src="/resource/moderator-button.png"/>
                    </button>
                </div>

                <div className="moderation-panel">
                    { this.state.selected == selection.point        && <PointsModeration circle={this.state.circle} />}
                    { this.state.selected == selection.moderator    && <ModeratorsModeration circle={this.state.circle} />}
                </div>
            </div>
        );
    }
    
    changeElement(selection){
        this.setState({
            selected: selection
        });
    }
    
    componentDidMount() {
        this.getCircle();
    }
    
    getCircle(){
        let component = this;
        
		fetch(API_URL + 'circles/' + this.props.params.circleId, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(circle) {
			if(circle) {
				handleAPIResult(component, false, "");
                
				component.setState({
					circle: circle
				});

			} else {
				handleAPIResult(component, true, "Une erreur est survenue lors de la récupération du cercle...");
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est survenue lors de la récupération du cercle...");
		});
    }
}

export default Moderation;