import React from 'react';
import { Link } from 'react-router';
import UsersAdmin from './UsersAdmin.jsx';

class Admin extends React.Component {
    render() {
        return (
            <div className="admin-page">
                <Link to="/app"><img className="home-button" src="/resource/home-button.png"></img></Link>
                <Link to="/userform"><img className="userform-button" src="/resource/user-button.png"></img></Link>
                <div className="admin-panel">
                    <UsersAdmin />
                </div>
            </div>
            
        );
    }
}

export default Admin;