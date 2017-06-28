import React from 'react';
import { Link } from 'react-router';
import { API_URL, handleAPIResult } from '../../common/Common.jsx';

class UsersAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
        
        this.getAllUsers = this.getAllUsers.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }
    
    render() {
        return (
            <table className="unstriped">
                <caption>Liste des utilisateurs</caption>
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Administrateur</th>
                        <th>Suppression</th>
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
                                    <td>{user.admin}</td>
                                    <td><button onClick={this.deleteUser.bind(this, user.id)} className="button">Supprimer</button></td>
                                </tr>
                            )
                        }, this)
                    }        
                </tbody>
            </table>
        );
    }
    
    componentDidMount() {
        this.getAllUsers();
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
    
    deleteUser(idUser){
        var component = this;
        
        if(!idUser){
            return;
        }
        
        fetch(API_URL + 'users/' + idUser, {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});
        
        this.setState({users: this.state.users.filter(function(user) { 
            return user.id !== idUser 
        })});
    }
}

export default UsersAdmin;