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
                    <div className="column medium-3" style={{height: "100%", border: "1px solid yellow"}}>

                    </div>
                    <div id="banner" className="column medium-9" style={{height: "100%", border: "1px solid violet", }}>
                    </div>
                </div>

                <div className="row" style={{height: "calc(100% - " + this.state.navbarHeight + "px"}}>
                    <Line />

                    <div className="column medium-3" style={{height: "100%", border: "1px solid orange"}}>
                    </div>
                </div>
            </div>
        );
    }
}
                
export default Circle;