import React from 'react';

class Point extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<li>
				<div className="presPoint row">
					<div className="userPoint column medium-6"><b>{this.props.idUser}</b></div>
					<div className="datePoint column medium-6">{this.props.created.toLocaleDateString()}</div>
				</div>
				<div className="row">
					<div className="point column medium-12">{this.props.content}</div>
				</div>
			</li>
		);
	}

	componentDidMount() {

	}
}

export default Point;