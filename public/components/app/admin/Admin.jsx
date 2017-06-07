import React from 'react';
import { Link } from 'react-router';
import UsersAdmin from './UsersAdmin.jsx';

class Admin extends React.Component {
    render() {
        return (
            <div className="admin-page">
                <Link to="/app"><img className="home-button" src="/resource/home.png"></img></Link>
                <div className="admin-panel">
                    <UsersAdmin />
                </div>
            </div>
            
        );
    }
}

export default Admin;