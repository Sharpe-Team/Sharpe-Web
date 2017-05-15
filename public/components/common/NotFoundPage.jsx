import React from 'react';
import { Link } from 'react-router';

class NotFoundPage extends React.Component {
    render() {
        return (
            <div className="not-found">
                <img className="not-found-image" src="/resource/not-found.png"/>
                <p className="not-found-link">
                    <Link to="/app">Retour à la page d'accueil</Link>
                </p>
            </div>
        );
    }
}

export default NotFoundPage;