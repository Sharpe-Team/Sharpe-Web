import React from 'react';
import Line from './Line.jsx';

class Circle extends React.Component {
    
    constructor(props) {
		super(props);
        
        this.state = {
            group: "Groupe 1",
            navbarHeight: 100
        };
    }
    
    render() {
        return (
            <div className="column medium-10" style={{height: "100%"}}>
                <div className="expanded row" style={{height: this.state.navbarHeight + "px"}}>
                    <div id="profile" className="column medium-3">
                    </div>
                    <div id="banner" className="column medium-9">
                    </div>
                </div>

                <div className="row" style={{height: "calc(100% - " + this.state.navbarHeight + "px"}}>
                    <Line style={{height: "100%"}}/>

                    <div id="cubes" className="column medium-3">
                    </div>
                </div>
            </div>
        );
    }
}
                
export default Circle;