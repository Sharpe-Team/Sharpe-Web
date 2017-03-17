import React from 'react';

class Point extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<li>
				<div className="presMessage">
					<div className="userMessage col-md-4">{this.props.user}</div>
					<div className="dateMessage col-md-8">{this.props.date.toString()}</div>
				</div>
				<div className="">
					<div className="message col-md-12">{this.props.text}</div>
				</div>
			</li>
		);
	}

	componentDidMount() {

	}
}

export default Point;