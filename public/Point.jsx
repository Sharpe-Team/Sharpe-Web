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
                <div className="row">
                    <div className="imageLine column medium-2">
                        <img className="userPicture" src={this.props.user.picture}/>
                    </div>
                    <div className="message column medium-10">
                        <div className="presMessage row">
                            <div className="userMessage column medium-4"><b>{this.props.user.name}</b></div>
                            <div className="dateMessage column medium-8">{this.renderDate(this.props.date)}</div>
                        </div>
                        <div className="row">
                            <div className="message column medium-12">{this.props.text}</div>
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