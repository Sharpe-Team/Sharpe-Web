import React from 'react';
import CubeIcon from "./CubeIcon.jsx";

class Point extends React.Component {

	constructor(props) {
		super(props);

		this.getDisplayedCube = this.getDisplayedCube.bind(this);
	}

	render() {
        let pictureUrl = this.props.point.user.profilePicture;
        if(!pictureUrl) {
            pictureUrl = "/resource/unknown-person.png";
        } else {
            pictureUrl = "/uploads/" + pictureUrl;
        }

        let displayedPoint;
        if(this.props.point.url) {
			displayedPoint = this.getDisplayedCube();
		} else {
        	displayedPoint = this.props.point.content;
		}

		return (
            <div className="row align-top">
                <div className="imageLine column medium-1">
                    <img className="userPicture" src={pictureUrl} />
                </div>
                <div className="column medium-11">
                    <div className="row">
                        <div className="userPoint column medium-6">
                            <b>{this.props.point.user.firstname}</b>
                            &nbsp;{this.props.point.user.lastname}
                        </div>
                        <div className="datePoint column medium-6">{this.renderDate(this.props.point.created)}</div>
                    </div>
                    <div className="row">
                        <div className="point column medium-12">{displayedPoint}</div>
                    </div>
                </div>
            </div>
		);
	}

	componentDidMount() {
	}

	renderDate(date) {
		let minutes = date.getMinutes();
		minutes = minutes < 10 ? '0' + minutes : minutes;
        if(this.props.date){
            return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + minutes;
        }
		return date.getHours() + ":" + minutes;
	}

	getDisplayedCube() {
		const image = ["jpg", "jpeg", "png", "bmp", "gif"];
		const audio = ["mp3", "flac", "ogg", "wave"];
		const video = ["mp4"];
		let extension = this.props.point.url.split(".").pop();

		if(image.includes(extension)) {
			return (
				<a href={"/uploads/" + this.props.point.url} target="_blank">
					<img src={"/uploads/" + this.props.point.url} style={{height: "200px"}} />
				</a>
			);
		} else if(audio.includes(extension)) {
			return (<audio src={"/uploads/" + this.props.point.url} controls />);
		} else if(video.includes(extension)) {
			return (<video src={"/uploads/" + this.props.point.url} controls style={{height: "200px"}} />);
		} else {
			let filename = this.props.point.url.split("/").pop();
			let name = filename.substring(0, filename.lastIndexOf("."));

			return (
				<div>
					<CubeIcon cube={this.props.point} />
					<a href={"/uploads/" + this.props.point.url} target="_blank">{name}</a>
				</div>
			);
		}
	}
}

export default Point;