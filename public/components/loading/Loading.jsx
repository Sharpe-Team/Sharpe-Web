import React from 'react';
import { generateLoadingMessage } from '../base/Common.jsx';

class Loading extends React.Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        var message = generateLoadingMessage(this.props.loadingFrom);
        
        return (      
            <div className="loading" style={{display: this.props.style}}>
                <div className="row spinner">
                    <span className="medium-1"></span> 
                    <div className="medium-1 rect1"></div>
                    <span className="medium-1"></span> 
                    <div className="medium-1 rect2"></div>
                    <span className="medium-1"></span>   
                    <div className="medium-1 rect3"></div>
                    <span className="medium-1"></span> 
                    <div className="medium-1 rect4"></div>
                    <span className="medium-1"></span> 
                    <div className="medium-1 rect5"></div>
                </div>
                <div className="row">
                    <div className="medium-12 loadingMessage">{message}</div>
                </div>
            </div>
        );
    }
    
    generateMessage(){
        
    }
}

export default Loading;