import React from 'react';

class Point extends React.Component {

	constructor(props) {
		super(props);
	}
    
    renderDate(date) {
        var minutes = date.getMinutes();
        minutes = minutes < 10 ? '0'+minutes : minutes;
        return date.getHours()+":"+minutes;
    }

	render() {
        var pictureUrl = (this.props.point.user.profilePicture);
        if(!pictureUrl) {
            pictureUrl = "/resource/toto.jpg";
        }
		return (
			<li>
                <div className="row align-middle">
                    <div className="imageLine column medium-1">
                        <img className="userPicture" src={'uploads/' + pictureUrl} />
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
                            <div className="point column medium-12">{this.props.point.content}</div>
                        </div>
                    </div>
                </div>
			</li>
		);
	}

	componentDidMount() {

	}
}

export default Point;