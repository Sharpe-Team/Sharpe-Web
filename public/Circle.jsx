import React from 'react';
import Line from './Line.jsx';

class Circle extends React.Component {
    
    constructor(props) {
		super(props);
        
        this.state = {
            group: "Groupe 1"
        };
    }
    
    render() {
        return (
            <Line />
        );
    }
}
                
export default Circle;