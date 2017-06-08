import React from 'react';
import { Link } from 'react-router';
import PointsModeration from './PointsModeration.jsx';
import ModeratorsModeration from './ModeratorsModeration.jsx';

const selection = {
    point : 0,
    request : 1,
    moderator : 2
}

class Admin extends React.Component {

    constructor(props){
        super(props);
        
        this.state = {
            selected: selection.point
        }
        
        this.changeElement = this.changeElement.bind(this);
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
                    { this.state.selected == selection.point && <PointsModeration />}
                    { this.state.selected == selection.moderator && <ModeratorsModeration />}
                </div>
            </div>
        );
    }
    
    changeElement(selection){
        this.setState({
            selected: selection
        });
    }
}

export default Admin;