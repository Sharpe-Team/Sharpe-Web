import React from 'react';

const TIME_BEFORE_REJECT = 5000;

class VideoChat extends React.Component {

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

		this.onGreenBtnClick = this.onGreenBtnClick.bind(this);
		this.onRedBtnClick = this.onRedBtnClick.bind(this);
		this.callPeer = this.callPeer.bind(this);
		this.endCall = this.endCall.bind(this);
		this.onReceiveCall = this.onReceiveCall.bind(this);
		this.answerCall = this.answerCall.bind(this);
		this.rejectCall = this.rejectCall.bind(this);
		this.askMediaDevicesPermission = this.askMediaDevicesPermission.bind(this);
		this.onReceiveStream = this.onReceiveStream.bind(this);
	}

	render() {
		//let greenBtnText = (this.state.isReceivingCall) ? "Répondre" : "Appeler";

		return (
			<div className="video-chat">
				<div className="row">
					<div className="column">
						{/*<audio id="audioStream" controls />*/}
						<video id="videoStream" controls style={{width: "100%"}} />
					</div>
				</div>
				<div className="row align-spaced">
					<div className="column medium-3" style={{textAlign: "center"}}>
						<button type="button" disabled={this.state.isCalling} onClick={this.onGreenBtnClick}>
							<img src="/resource/green-phone.png" width="40"/>
						</button>
					</div>
					<div className="column medium-3"  style={{textAlign: "center"}}>
						<button type="button" disabled={!this.state.isCalling} onClick={this.onRedBtnClick}>
							<img src="/resource/red-phone.png" width="40"/>
						</button>
					</div>
				</div>
				{ this.state.isReceivingCall &&
					<div className="row">
						<div className="column">
							{this.props.circle.receiverUser.firstname} vous appelle...
						</div>
					</div>
				}
			</div>
		);
	}

	componentDidMount() {
		if(!peer) {
			peer = new Peer(userId, {
				host: 'localhost', port: 3000, path: '/peerjs',
				config: {
					'iceServers': [
						{url: 'stun:stun1.l.google.com:19302'},
						{url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com'}
					]
				},
				debug: 2
			});
		}
		peer.on('call', this.onReceiveCall);
	}

	onGreenBtnClick() {
		if(this.state.isReceivingCall) {
			this.answerCall();
		} else if(!this.state.isCalling) {
			this.callPeer();
		}
	}

	onRedBtnClick() {
		if(this.state.isReceivingCall) {
			this.rejectCall();
		} else if(this.state.isCalling) {
			this.endCall();
		}
	}

	/****************************************************************
	 * 						PEERJS FUNCTIONS						*
	 ****************************************************************/

	callPeer() {
		let component = this;

		this.askMediaDevicesPermission(function(mediaStream) {
			let mediaConnection = peer.call(component.props.circle.receiverUser.id, mediaStream);
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

	onReceiveCall(mediaConnection) {
		let component = this;

		this.setState({
			isReceivingCall: true,
			mediaConnection: mediaConnection
		});

		// If the caller ends the call before the user could answer it, close the connection
		// TODO: do something working... (to prevent the user to answer to a call that has been ended by the caller)
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

export default VideoChat;