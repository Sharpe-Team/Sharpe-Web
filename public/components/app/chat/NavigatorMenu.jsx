import React from 'react';
import { Link, browserHistory } from 'react-router';

class NavigatorMenu extends React.Component {
    render(){
        return (
            <div id="search" className="row">
                <Link  to="/userform"><img className="user-form-button" src="/resource/user.png"></img></Link>
                <Link  to="/circleform"><img className="circle-form-button" src="/resource/circle.png"></img></Link>
                <Link  to="/logout"><img className="logout-form-button" src="/resource/logout.png"></img></Link>
            </div>
        );
    }
}

export default NavigatorMenu;