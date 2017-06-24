import React from 'react';

class ImageUploadItem extends React.Component {

    constructor(props) {
		super(props);
        
        this.state = {
            percent: 0,
            image: ""
        }
    }
    
    render() {
        return (
            <div className="row">
                <div className="column medium-4">
                    <label htmlFor="" className="text-right middle form-label">{this.props.label}</label>
                </div>
                <div className="column medium-7 medium-offset-1">
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
        );
    }
    
    componentDidMount() {
		const component = this;
        let siofu = new SocketIOFileUpload(socket);

        siofu.listenOnInput(document.getElementById(this.props.id));
        
        siofu.addEventListener("load", function(event) {
	    	// Save the name given by the server to the current picture
	    	component.setState({
                image: event.name
            });
	    });

		// Do something on upload progress:
		siofu.addEventListener("progress", function(event) {
		    let percent = event.bytesLoaded / event.file.size * 100;
            component.setState({
                percent: percent
            });
		});

        siofu.addEventListener("complete", function(event) {
            if(event.success) {
                let currentName = event.file.name;
                let extension = currentName.substring(currentName.lastIndexOf("."));
                let finalPath = component.state.image + extension;

                // Call a function to parent to notify the picture is uploaded successfully
                component.props.callback(finalPath);
            } else {
                component.setState({
                    image: undefined
                });
                component.props.callback(undefined);
                alert("Une erreur est survenue lors de l'envoi des images...");
            }
        });
	}
}

export default ImageUploadItem;