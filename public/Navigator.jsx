import React from 'react';
import {Link, browserHistory} from 'react-router';

class Navigator extends React.Component {
    
    constructor(props) {
		super(props);

        this.state = {
            circles: [],
            users: [
                {
                    id: 1,
                    name: "User 1"
                },
                {
                    id: 2,
                    name: "User 2"
                },
                {
                    id: 3,
                    name: "User 3"
                }
            ]
        }

        this.getAllCircles = this.getAllCircles.bind(this);
    }
    
    render() {
        return (
            <div id="left-column" className="column medium-2">
                <div id="search" className="row">
                    <div className="medium-1"></div>
                    <Link className="medium-2" to="/userform"><img className="user-form-button" src="/resource/user.png"></img></Link>
                    <div className="medium-2"></div>
                    <Link className="medium-2" to="/circleform"><img className="circle-form-button" src="/resource/circle.png"></img></Link>
                    <div className="medium-2"></div>
                    <Link className="medium-2" to="/logout"><img className="logout-form-button" src="/resource/logout.png"></img></Link>
                    <div className="medium-1"></div>
                </div>
                <ul className="navigationList" style={{height: "40%"}}>
                    {
                        this.state.circles.map(function(circle) {
                            return <div key={circle.id} onClick={this.props.updateSelectedCircle.bind(this, circle)} className="row circleListItem">{circle.name}</div>
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

    componentWillMount() {
        this.getAllCircles();
    }

    getAllCircles() {
        var component = this;

        fetch('http://localhost:8080/circles', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(circles) {
            component.setState({circles: circles});

            if(circles.length > 0) {
                component.props.updateSelectedCircle(circles[0]);
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    }
    
}

export default Navigator;