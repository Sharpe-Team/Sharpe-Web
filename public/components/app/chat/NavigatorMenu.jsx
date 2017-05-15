import React from 'react';
import { Link, browserHistory } from 'react-router';

class NavigatorMenu extends React.Component {
    render(){
        return (
            <div id="search" className="row">
                <Link  to="/"><img className="nav-button" src="/resource/circlehome.png"/></Link>
                <Link  to="/userform"><img className="nav-button" src="/resource/user.png"></img></Link>
                <Link  to="/circleform"><img className="nav-button" src="/resource/circle.png"></img></Link>
                <Link  to="/logout"><img className="nav-button" src="/resource/logout.png"></img></Link>
            </div>
        );
    }
}

export default NavigatorMenu;