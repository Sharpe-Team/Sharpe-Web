import React from 'react';

class RequestModeration extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            requests: [],
            circle: this.props.circle
        }
        
        this.getRequests = this.getRequests.bind(this);
    }
    
    render(){
        return (
            <div>A compléter</div>
        );
    }
    
    componentDidMount() {
        this.getRequests();
    }
    
    getRequests(){
        let component = this;
        
        this.setState({users: []});
        
        fetch(API_URL + 'joining-requests/?circle_id=' + this.state.circle.id, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(requests) {
			if(requests) {
				handleAPIResult(component, false, "");

				component.setState({
					requests: requests
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
}

export default RequestModeration;