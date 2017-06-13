import React from 'react';
import { Link } from 'react-router';

class NotAuthorizedPage extends React.Component {
    render() {
        return (
            <div className="not-authorized">
                <img className="not-authorized-image" src="/resource/not-authorized.png"/>
                <p className="not-authorized-link">
                    <Link to="/app">Retour à la page d'accueil</Link>
                </p>
            </div>
        );
    }
}

export default NotAuthorizedPage;