import React from 'react';

const TIME_BEFORE_REJECT = 5000;

class Cube extends React.Component {

	constructor(props) {
		super(props);

		let userId = parseInt(localStorage.getItem("user-id"));

		this.state = {
			user: {
				id: userId
			},
			isReceivingCall: false,
			isCalling: false,
			mediaConnection: undefined
		};

		this.callPeer = this.callPeer.bind(this);
		this.endCall = this.endCall.bind(this);
		this.onReceiveCall = this.onReceiveCall.bind(this);
		this.answerCall = this.answerCall.bind(this);
		this.rejectCall = this.rejectCall.bind(this);
		this.askMediaDevicesPermission = this.askMediaDevicesPermission.bind(this);
		this.onReceiveStream = this.onReceiveStream.bind(this);
	}

	render() {
		return (
			<div id="cubes" className="column medium-2">
				<div className="row">
					{ this.props.circle.type === 2 && this.props.circle.receiverUserId !== this.state.user.id &&
						<div className="column">
							<button type="button" className="button primary" disabled={this.state.isCalling || this.state.isReceivingCall} onClick={this.callPeer}>Appeler</button>
							<button type="button" className="button alert" disabled={!this.state.isCalling || this.state.isReceivingCall} onClick={this.endCall}>Raccrocher</button>
							<button type="button" className="button success" disabled={!this.state.isReceivingCall} onClick={this.answerCall}>Répondre</button>
							<button type="button" className="button alert" disabled={!this.state.isReceivingCall} onClick={this.rejectCall}>Annuler</button>
							{/*<audio id="audioStream" controls></audio>*/}
							<video id="videoStream" controls style={{width: "100%"}}></video>
						</div>
					}
				</div>
			</div>
		);
	}

	componentDidMount() {
		peer.on('call', this.onReceiveCall);
	}

	/****************************************************************
	 * 						PEERJS FUNCTIONS						*
	 ****************************************************************/

	callPeer() {
		let component = this;

		this.askMediaDevicesPermission(function(mediaStream) {
			let mediaConnection = peer.call(component.props.circle.receiverUserId, mediaStream);
			mediaConnection.on("stream", component.onReceiveStream);
			mediaConnection.on("close", function() {
				component.endCall();
			});

			component.setState({
				isCalling: true,
				mediaConnection: mediaConnection
			});

			setTimeout(function() {
				// If the peer user has not answered to the call after 5 seconds, ends it
				if(component.state.isCalling
					&& component.state.mediaConnection
					&& !component.state.mediaConnection.open) {
					component.endCall();
				}
			}, TIME_BEFORE_REJECT);
		});
	}

	endCall() {
		if(this.state.isCalling && this.state.mediaConnection) {
			this.state.mediaConnection.close();
		}

		this.setState({
			isCalling: false,
			mediaConnection: undefined
		});
	}

	onReceiveCall(mediaConnection) {
		let component = this;

		this.setState({
			isReceivingCall: true,
			mediaConnection: mediaConnection
		});

		// If the caller ends the call before the user could answer it, close the connection
		mediaConnection.on("close", function() {
			component.rejectCall();
		});

		setTimeout(function() {
			// If the user has not answered to the call after 5 seconds, rejects it
			if(component.state.isReceivingCall
				&& component.state.mediaConnection
				&& !component.state.mediaConnection.open) {
				component.rejectCall();
			}
		}, TIME_BEFORE_REJECT);
	}

	answerCall() {
		let component = this;
		let mediaConnection = this.state.mediaConnection;

		this.setState({
			isReceivingCall: false,
			isCalling: true
		});

		this.askMediaDevicesPermission(function(mediaStream) {
			mediaConnection.answer(mediaStream);

			mediaConnection.on("stream", component.onReceiveStream);
			mediaConnection.on("close", function() {
				component.endCall();
			});
		});
	}

	rejectCall() {
		if(this.state.mediaConnection) {
			this.state.mediaConnection.close();
		}

		this.setState({
			isReceivingCall: false,
			mediaConnection: undefined
		});
	}

	askMediaDevicesPermission(callback) {
		let component = this;
		let constraints = {
			audio: true,
			video: true
		};

		// Older browsers might not implement mediaDevices at all, so we set an empty object first
		if (navigator.mediaDevices === undefined) {
			navigator.mediaDevices = {};
		}

		// Some browsers partially implement mediaDevices. We can't just assign an object
		// with getUserMedia as it would overwrite existing properties.
		// Here, we will just add the getUserMedia property if it's missing.
		if (navigator.mediaDevices.getUserMedia === undefined) {
			navigator.mediaDevices.getUserMedia = function(constraints) {
				// First get ahold of the legacy getUserMedia, if present
				let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

				// Some browsers just don't implement it - return a rejected promise with an error
				// to keep a consistent interface
				if (!getUserMedia) {
					return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
				}

				// Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
				return new Promise(function(resolve, reject) {
					getUserMedia.call(navigator, constraints, resolve, reject);
				});
			}
		}

		navigator.mediaDevices.getUserMedia(constraints)
			.then(function(mediaStream) {
				callback(mediaStream);
			})
			.catch(function(error) {
				console.log("Error while getting userMedia function : " + error);
				component.rejectCall();
				alert(error);
			});
	}

	onReceiveStream(stream) {
		/*
		let audioComponent = document.getElementById("audioStream");
		audioComponent.src = window.URL.createObjectURL(stream);
		audioComponent.onloadedmetadata = function(e) {
			audioComponent.play();
		}
		*/

		let videoComponent = document.getElementById("videoStream");
		videoComponent.src = window.URL.createObjectURL(stream);
		videoComponent.onloadedmetadata = function(e) {
			videoComponent.play();
		}
	}

}

export default Cube;