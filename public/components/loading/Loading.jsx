import React from 'react';

class Loading extends React.Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="loading" style={{display: this.props.style}}>
                <div className="row spinner">
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
            </div>
        );
    }
}

export default Loading;