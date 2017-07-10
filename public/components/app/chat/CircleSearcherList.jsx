import React from 'react';
import { API_URL, handleAPIResult, getUserFromStorage } from '../../common/Common.jsx';

class CircleSearcherList extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			circles: [],
            joiningRequests: [],
            search: this.props.search
		};

		this.getAllCircles = this.getAllCircles.bind(this);
        this.isNotLinked = this.isNotLinked.bind(this);
        this.getJoiningRequests = this.getJoiningRequests.bind(this);
    }
    
    render() {
		return (
			<div>
				<ul id="circle-search">
					{
						this.state.circles.map(function(circle) {
                            if(circle.name.toLowerCase().includes(this.state.search.toLowerCase())) {
                                
                                let requestStatus = (<img className="request-icon" src={'resource/validated-request.png'}/>);
                                
                                if(this.isNotLinked(circle.id)) {
                                    requestStatus = (<button onClick={this.createJoiningRequest.bind(this, circle.id)} className="button tiny join-button">Rejoindre</button>);
                                } else if(this.requestIsCreated(circle.id)) {
                                    requestStatus = (<img className="request-icon" src={'resource/waiting-request.png'}/>);
                                }
                                
                                return (
                                    <li id="circle-search-item" key={circle.id}>
                                        <div className="row">
                                            <div className="column medium-1">
                                                <div className="circularImageContainer-search">
                                                    { circle.pictureUrl &&
                                                        <img className="search-picture" src={'uploads/' + circle.pictureUrl}/>
                                                    }
                                                </div>
                                            </div>
                                            <div className="column medium-10">{circle.name}</div>
                                            <div className="column medium-1">
                                                {requestStatus}
                                            </div>
                                        </div>
                                    </li>
                                )   
                            }
						}, this)
					}
				</ul>
			</div>
		);
	}
    
    componentDidMount() {
		this.getAllCircles();
        this.getJoiningRequests();
	}
    
    componentWillReceiveProps(nextProps){
        this.setState({
            search: nextProps.search
        });
    }
    
    getAllCircles() {
		let component = this;
        
		fetch(API_URL + 'circles/publics', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(circles) {
			if(circles) {
				handleAPIResult(component, false, "");

				component.setState({
					circles: circles
				});

			} else {
				handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des cercles...");
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des cercles...");
		});
	}
    
    isNotLinked(idCircle){
        var rucs = getUserFromStorage().ruc;
        
        for(let i=0; i<rucs.length; i++){
            if(rucs[i].idCircle == idCircle){
                return false;
            }
        }
        
        for(let j=0; j<this.state.joiningRequests.length; j++){
            if(this.state.joiningRequests[j].idCircle == idCircle){
                return false;
            }
        }
        
        return true;
    }
    
    requestIsCreated(idCircle){
        for(let j=0; j<this.state.joiningRequests.length; j++){
            if(this.state.joiningRequests[j].idCircle == idCircle){
                return true;
            }
        }
        
        return false;
    }
    
    getJoiningRequests(){
        var component = this;
        
        var userId = getUserFromStorage().id;
        
        fetch(API_URL + 'joining-requests/?user_id=' + userId, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(joiningRequests) {
			if(joiningRequests) {
				handleAPIResult(component, false, "");

				component.setState({
					joiningRequests: joiningRequests
				});

			} else {
				handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des demandes...");
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des demandes...");
		});
    }
    
    createJoiningRequest(circleId){
        var component = this;
        
        var userId = getUserFromStorage().id;
        
        fetch(API_URL + 'joining-requests', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			},
			body: JSON.stringify({
				idCircle: circleId,
                idUser: userId
			})
		})
		.then(function(response) { 
            return response.json();
		})
		.then(function(joiningRequest) {
			if(joiningRequest){
                var newJoiningRequests = component.state.joiningRequests;
                newJoiningRequests.push(joiningRequest);
                component.setState({joiningRequests: newJoiningRequests});
                
				handleAPIResult(component, false, "");
            } else {
				handleAPIResult(component, true, "Une erreur est survenue lors de la demande !");
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est survenue lors de la demande !");
		});
    }
}

export default CircleSearcherList;