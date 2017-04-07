import React from 'react';

class Navigator extends React.Component {
    
    constructor(props) {
		super(props);
        this.state = {
            circles: props.circles,
            users: props.users
        }
    }
    
    render() {
        return (
            <div id="left-column" className="column medium-2">
                <div id="search" className="row">
                    <input type="text" id="search-text" className="column medium-10" />
                    <button type="button" id="search-button" className="column medium-2 button">Go!</button>
                </div>
                <ul className="navigationList" style={{height: "40%"}}> 
                    {
                        this.state.circles.map(function(circle) {
                            return <div key={circle.id} onClick={this.props.updateSelectedCircle.bind(this, circle.id)} className="row circleListItem">{circle.name}</div>
                        }, this)
                    }
                </ul>
                <hr></hr>
                <ul className="navigationList" style={{height: "40%"}}> 
                    {
                        this.state.users.map(function(user){
                            return <div key={user.id} className="row circleListItem">{user.name}</div>
                        })
                    }
                </ul>
			</div>
        );
    }
    
}

export default Navigator;