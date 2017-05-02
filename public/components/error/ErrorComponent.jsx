import React from 'react';

class ErrorComponent extends React.Component {

	constructor(props) {
		super(props);

		this.handleClosingAlert = this.handleClosingAlert.bind(this);
	}

	render() {
		return (
			<div id="error-message" className="alert callout">
				<p style={{fontSize: "0.8em", margin: "0px"}}>{this.props.message}</p>
				<button className="close-button" aria-label="Dismiss alert" type="button" onClick={this.handleClosingAlert}>
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
		);
	}

	handleClosingAlert() {
		// update parent's state
		this.props.hideError();
	}
}

export default ErrorComponent;