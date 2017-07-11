import React from 'react';
import { API_URL, handleAPIResult } from '../../common/Common.jsx';

class InsertImageItem extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			image: "",
			percent: 0,
			finalPath: ""
		};

		this.saveNewImage = this.saveNewImage.bind(this);
	}

	render() {
		return (
			<div>
				<label htmlFor="new-image" className="button insert-btn">+</label>
				<input type="file" id="new-image" name="newImage" className="show-for-sr" accept="image/*"/>
			</div>
		);
	}

	componentDidMount() {
		const component = this;
		let siofu = new SocketIOFileUpload(socket);

		siofu.listenOnInput(document.getElementById("new-image"));

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

				// save the image in DB
				component.saveNewImage(finalPath);
			} else {
				component.setState({
					image: undefined,
					finalPath: undefined
				});
				alert("Une erreur est survenue lors de l'envoi des images...");
			}
		});
	}

	saveNewImage(file) {
		const component = this;

		//displayLoading(this);
		fetch(API_URL + 'cubes', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			},
			body: JSON.stringify({
				idLine: component.props.idLine,
				idUser: component.props.idUser,
				url: file,
				created: new Date()
			})
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(cube) {
			if(cube) {
				handleAPIResult(component, false, "");

				if(component.props.circle.type == 2) {
					// Send a private cube to the receiver user
					socket.emit('new-private-cube', cube, component.props.circle.receiverUserId);
				} else {
					// Send the new point to the connected users
					socket.emit('new-cube', cube);
				}
			} else {
				handleAPIResult(component, true, "Une erreur est apparue lors de l'ajout du cube...");
			}
			component.props.updateParentState(component.state.error, component.state.displayLoading);
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est apparue lors de l'ajout du cube...");
			component.props.updateParentState(component.state.error, component.state.displayLoading);
		});
	}
}

export default InsertImageItem;