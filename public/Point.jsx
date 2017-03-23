import React from 'react';

class Point extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<li>
				<div className="presMessage row">
					<div className="userMessage column medium-4"><b>{this.props.user}</b></div>
					<div className="dateMessage column medium-8">{this.props.date.toLocaleDateString()}</div>
				</div>
				<div className="row">
					<div className="message column medium-12">{this.props.text}</div>
				</div>
			</li>
		);
	}

	componentDidMount() {

	}
}

export default Point;