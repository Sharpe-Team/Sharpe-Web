import React from 'react';

class Point extends React.Component {

	constructor(props) {
		super(props);
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
			displayedPoint = (
				<img src={"/uploads/" + this.props.point.url} style={{height: "200px"}} />
			);
		} else {
        	displayedPoint = this.props.point.content;
		}

		return (
			<li>
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
			</li>
		);
	}

	componentDidMount() {
	}

	renderDate(date) {
		let minutes = date.getMinutes();
		minutes = minutes < 10 ? '0' + minutes : minutes;
		return date.getHours() + ":" + minutes;
	}
}

export default Point;