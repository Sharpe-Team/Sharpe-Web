import React from 'react';
import { Link } from 'react-router';
import PointsModeration from './PointsModeration.jsx';

const selection = {
    point : 0,
    request : 1
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
                <Link to="/app"><img className="home-button" src="/resource/home-button.png"></img></Link>
                <button onClick={this.changeElement.bind(this, selection.point)}><img className="point-button" src="/resource/point-button.png"></img></button>
                <button onClick={this.changeElement.bind(this, selection.request)}><img className="request-button" src="/resource/request-button.png"></img></button>
                <div className="moderation-panel">
                    { this.state.selected == selection.point && <PointsModeration />}
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