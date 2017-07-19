import React from 'react';

class CubeIcon extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            cube: this.props.cube,
            iconUrl: "/resource/file-icon/"+this.props.cube.url.split('.').pop()+"-icon.png"
        };
        
        this.onError = this.onError.bind(this);
    }
    
    render(){
        return (
            <a href={"/uploads/"+this.state.cube.url} target="_blank">
                <img className="cube-space-icon" src={this.state.iconUrl} onError={this.onError} />
            </a>
            
        )
    }
    
    onError() {
        this.setState({
            iconUrl: "/resource/file-icon/file-icon.png"
        });
    }
}

export default CubeIcon;