import React from 'react';
import { Link } from 'react-router';

class NoCircle extends React.Component {
    constructor(props){
        super(props);
    }
    
    render(){
        return (
            <div className="column medium-10 no-circle">
                <div className="row">
                    <div className="medium-12 no-circle-message"><b>Vous ne participez toujours pas à un cercle, rejoignez les cercles existants ou créez-en un !</b></div>
                </div>
                <div className="row align-center">
                    <Link className="medium-2 no-circle-button" to="/circlesearch"><img src="/resource/circlesearch-no-circle.png"></img></Link>
                    <Link className="medium-2 no-circle-button" to="/circleform"><img src="/resource/circle-no-circle.png"></img></Link>
                </div>
            </div>
        );
    }
}

export default NoCircle;