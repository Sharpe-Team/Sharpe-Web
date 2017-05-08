import React from 'react';

class ImageUploadItem extends React.Component {
    constructor(props) {
		super(props);
        
        this.state = {
            percent: 0
        }
    }
    
    render(){
        return (
            <div className="row">
                <div className="column medium-4">
                    <label htmlFor="" className="text-right middle form-label">{this.props.label}</label>
                </div>
                <div className="colum medium-1"></div>
                <div className="column medium-7">
                    <div className="row align-middle upload-row">
                        <div className="column shrink">
                            <label htmlFor={this.props.id} className="button">{this.props.buttonLabel}</label>
                            <input type="file" id={this.props.id} name={this.props.name} className="show-for-sr" accept="image/*" onChange={this.props.onChange}/>
                        </div>
                        <div className="column progress-div">
                            <progress max="100" value={this.state.percent}></progress>
                        </div>
                        <div className="column shrink">{this.state.percent}%</div>
                    </div>
                </div>
            </div>
        )
    }
    
    componentDidMount() {

		var component = this;

		this.props.siofu.listenOnInput(document.getElementById(this.props.id));

		// Do something on upload progress:
		this.props.siofu.addEventListener("progress", function(event) {
		    var percent = event.bytesLoaded / event.file.size * 100;
            component.setState({percent: percent});
		});
	}
}

export default ImageUploadItem;