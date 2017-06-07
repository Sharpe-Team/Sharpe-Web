import React from 'react';
import { Link } from 'react-router';
import { getUserFromStorage } from '../../common/Common.jsx'

class NavigatorMenu extends React.Component {
    render(){
        return (
            <div id="search" className="row">
                {   
                    getUserFromStorage().admin == 1 && 
                    <Link  to="/userform"><img className="nav-button" src="/resource/user.png"></img></Link>
                }
                {   
                    getUserFromStorage().admin == 1 && 
                    <Link  to="/admin"><img className="nav-button" src="/resource/admin.png"></img></Link>
                }
                <Link  to="/circleform"><img className="nav-button" src="/resource/circle.png"></img></Link>
                <Link  to="/logout"><img className="nav-button" src="/resource/logout.png"></img></Link>
            </div>
        );
    }
}

export default NavigatorMenu;