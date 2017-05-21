import React from 'react';
import { getUserFromStorage } from '../../common/Common.jsx';

class Cube extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			user: undefined,
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
					{ this.props.circle.type === 2 &&
						<div className="column">
							<button type="button" className="button primary" disabled={this.state.isCalling || this.state.isReceivingCall} onClick={this.callPeer}>Appeler</button>
							<button type="button" className="button success" disabled={!this.state.isReceivingCall} onClick={this.answerCall}>Répondre</button>
							<button type="button" className="button alert" disabled={!this.state.isReceivingCall} onClick={this.rejectCall}>Annuler</button>
							<audio id="audioStream" controls></audio>
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

			component.setState({
				isCalling: true,
				mediaConnection: mediaConnection
			});
		});
	}

	endCall() {
		if(this.state.isCalling && this.state.mediaConnection) {
			this.state.mediaConnection.close();

			this.setState({
				isCalling: false,
				mediaConnection: undefined
			});
		}
	}

	onReceiveCall(mediaConnection) {
		let component = this;

		this.setState({
			isReceivingCall: true,
			mediaConnection: mediaConnection
		});

		setTimeout(function() {
			// If the user has not answered to the call after 5 seconds, rejects it
			if(component.state.isReceivingCall
				&& component.state.mediaConnection
				&& component.state.mediaConnection.open()) {
				component.rejectCall();
			}
		}, 5000);
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
			video: false
		};

		navigator.mediaDevices.getUserMedia(constraints)
			.then(function(mediaStream) {
				callback(mediaStream);
			})
			.catch(function(error) {
				console.log(error);
				component.rejectCall();
			});
	}

	onReceiveStream(stream) {
		let audioComponent = document.getElementById("audioStream");
		audioComponent.src = window.URL.createObjectURL(stream);
		audioComponent.onloadedmetadata = function(e) {
			audioComponent.play();
		}
	}

}

export default Cube;