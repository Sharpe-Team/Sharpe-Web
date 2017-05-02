import React from 'react';
import { Link, browserHistory } from 'react-router';

class NavigatorMenu extends React.Component {
    render(){
        return (
            <div id="search" className="row">
                <div className="medium-1"></div>
                <Link className="medium-2" to="/userform"><img className="user-form-button" src="/resource/user.png"></img></Link>
                <div className="medium-2"></div>
                <Link className="medium-2" to="/circleform"><img className="circle-form-button" src="/resource/circle.png"></img></Link>
                <div className="medium-2"></div>
                <Link className="medium-2" to="/logout"><img className="logout-form-button" src="/resource/logout.png"></img></Link>
                <div className="medium-1"></div>
            </div>
        );
    }
}

export default NavigatorMenu;