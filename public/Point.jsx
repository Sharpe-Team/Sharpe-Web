import React from 'react';

class Point extends React.Component {

	constructor(props) {
		super(props);
	}
    
    renderDate(date){
        var minutes = date.getMinutes();
        minutes = minutes < 10 ? '0'+minutes : minutes;
        return date.getHours()+":"+minutes;
    }

	render() {
		return (
			<li>
                <div className="row align-middle">
                    <div className="imageLine column medium-1">
                        <img className="userPicture" src={this.props.user.picture}/>
                    </div>
                    <div className="column medium-11">
                        <div className="row">
                            <div className="userPoint column medium-6"><b>{this.props.user.name}</b></div>
                            <div className="datePoint column medium-6">{this.renderDate(this.props.created)}</div>
                        </div>
                        <div className="row">
                            <div className="point column medium-12">{this.props.content}</div>
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