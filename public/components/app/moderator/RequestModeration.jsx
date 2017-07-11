import React from 'react';
import { API_URL, handleAPIResult } from '../../common/Common.jsx';

class RequestModeration extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            requests: [],
            circle: this.props.circle
        }
        
        this.getRequests = this.getRequests.bind(this);
        this.manageRequest = this.manageRequest.bind(this);
    }
    
    render(){
        return (
            <table className="unstriped">
                <caption>Liste des demandes</caption>
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Administrateur</th>
                        <th>Valider / Refuser</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.requests.map(function(user) {
                            return (
                                <tr key={user.id}>
                                    <td>{user.firstname}</td>
                                    <td>{user.lastname}</td>
                                    <td>{user.email}</td>
                                    <td>{user.admin}</td>
                                    <td>
                                        <button onClick={this.manageRequest.bind(this, user.id, true)} className="button success request-validation-button">Valider</button>
                                        <button onClick={this.manageRequest.bind(this, user.id, false)} className="button alert request-validation-button">Refuser</button>
                                    </td>
                                </tr>
                            )
                        }, this)
                    }        
                </tbody>
            </table>
        );
    }
    
    componentDidMount() {
        this.getRequests();
    }
    
    getRequests(){
        let component = this;
        
        fetch(API_URL + 'joining-requests/?circle_id=' + this.props.circle.id, {
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
    
    manageRequest(idUser, accepted){
        let component = this;
        
        fetch(API_URL + 'joining-requests?user_id=' + idUser + '&circle_id=' + this.state.circle.id + '&accepted=' + accepted, {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function(response) {
			return response;
		})
		.then(function(response) {
			if(response) {
				handleAPIResult(component, false, "");      
                
                component.setState({requests: component.state.requests.filter(function(request) {
                    if(request.id == idUser)
                        return false;
                    return true;
                })});
			} else {
				handleAPIResult(component, true, "Une erreur est survenue lors de la validation de la demande...");
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est survenue lors de la validation de la demande...");
		});
    }
}

export default RequestModeration;