import React from 'react';
import { Link } from 'react-router';
import { API_URL, handleAPIResult } from '../../common/Common.jsx';

class ModeratorsModeration extends React.Component {
 
    constructor(props){
        super(props);
        
        this.state = {
			moderators: [],
            users: [],
            circl: this.props.circle
        }
        
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getAllModerators = this.getAllModerators.bind(this);
    }
    
    render() {
        return (
            <div className="row">
                <table className="column medium-4 unstriped">
                    <caption>Modérateurs</caption>
                    <thead>
                        <tr>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.moderators.map(function(user) {
                                return (
                                    <tr key={user.id}>
                                        <td>{user.firstname}</td>
                                        <td>{user.lastname}</td>
                                        <td>{user.email}</td>
                                    </tr>
                                )
                            }, this)
                        }        
                    </tbody>
                </table>
                <table className="column medium-7 unstriped medium-offset-1">
                    <caption>Utilisateurs</caption>
                    <thead>
                        <tr>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Ajouter</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.users.map(function(user) {
                                return (
                                    <tr key={user.id}>
                                        <td>{user.firstname}</td>
                                        <td>{user.lastname}</td>
                                        <td>{user.email}</td>
                                        <td><button className="button">Ajouter</button></td>
                                    </tr>
                                )
                            }, this)
                        }        
                    </tbody>
                </table>
            </div>
        );
    }
    
    componentDidMount() {
        this.getAllUsers();
        this.getAllModerators();
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.circle){
            this.setState({
               circle: nextProps.circle 
            });
            this.getAllPoints(nextProps.circle.id);   
        }
    }
    
    getAllModerators(idCircle){
        let component = this;
        
        if(!idCircle) {
			if(!this.state.idCircle) {
				this.setState({users: [], moderators: []});
				return;
			} else {
				idCircle = this.state.circle.id;
			}
		} else if(idCircle && this.state.circle && idCircle == this.state.circle.id) {
			return;
		}
        
        fetch(API_URL + 'rucs?role_id=' + 1 + "&circle_id=" + idCircle, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(users) {
			if(users) {
				handleAPIResult(component, false, "");

				component.setState({
					users: users
				});
			} else {
				handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des utilisateurs...");
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des utilisateurs...");
		});   
    }
    
    getAllUsers(){
        let component = this;
        
        fetch(API_URL + 'users', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(users) {
			if(users) {
				handleAPIResult(component, false, "");

				component.setState({
					users: users
				});
			} else {
				handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des utilisateurs...");
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des utilisateurs...");
		});   
    }
    
    
}

export default ModeratorsModeration;