import React from 'react';

class Announcement extends React.Component {

	constructor(props) {
		super(props);

		this.handleClosingAlert = this.handleClosingAlert.bind(this);
	}

	render() {
		return (
			<div id="error-message" className="callout warning announcement">
                <img className="announcement-icon" src="/resource/announcement-button.png"/>
				<p className="announcement-p">{this.props.message}</p>
				<button className="close-button" aria-label="Dismiss alert" type="button" onClick={this.handleClosingAlert}>
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
		);
	}

	handleClosingAlert() {
		// update parent's state
		this.props.hideAnnouncement();
	}
}

export default Announcement;