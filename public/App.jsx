import React from 'react';
import Users from './Users.jsx';
import Circle from './Circle.jsx';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			navbarHeight: 50
		};
	}

	render() {
		return (
			<div id="div-app row medium-uncollapse medium-12" style={{height:"100%"}}>
                <div className="column callout medium-2" style={{height:"100%"}}>
                    <div className="row">
						<a href="">Circle 1</a>
					</div>
					<div className="row">
						<a href="">Circle 2</a>
					</div>
                </div>
                <div id="circle" className="column callout medium-10" style={{height:"100%"}}>
                    <div id="top-circle" className="row">
                        <div id="pp-circle" className="column callout medium-3" style={{height:"100%"}}></div>
                        <div id="banner-circle" className="column callout medium-9" style={{height:"100%"}}></div>
                    </div>
                    <div id="content-circle" className="row">
                        <div id="line-circle" className="column callout medium-9" style={{height: "100%"}}>
                            <Circle />
                        </div>
                    </div>
                </div>
			</div>
		);
	}

	componentDidMount() {
		/*
		socket.on('init', function(username) {
			console.log("Receive 'init' event !!");
			console.log('Mon nom : ' + username);
		});
		*/
	}
}

export default App;