import React from 'react';
import { Link } from 'react-router';
import { API_URL, handleAPIResult } from '../../common/Common.jsx';

class ModeratorsModeration extends React.Component {
 
    constructor(props){
        super(props);
        
        this.state = {
			moderators: [],
            users: [],
            firstRequestIsFinished: false,
            circle: this.props.circle
        }
        
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getAllModerators = this.getAllModerators.bind(this);
        this.addAsModerator = this.addAsModerator.bind(this);
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
                                        <td><button className="button" onClick={this.addAsModerator.bind(this, user.id)}>Ajouter</button></td>
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
			if(!this.state.circle.id) {
				this.setState({moderators: []});
				return;
			} else {
				idCircle = this.state.circle.id;
			}
		} else if(idCircle && this.state.circle && idCircle == this.state.circle.id) {
			return;
		}
        
        fetch(API_URL + 'rucs?role_id=' + 2 + "&circle_id=" + idCircle, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(moderators) {
			if(moderators) {
				handleAPIResult(component, false, "");

				component.setState({
					moderators: moderators
				});
                
                if(component.state.firstRequestIsFinished){
                    component.filterUsers();
                } else {
                    component.setState({firstRequestIsFinished: true});
                }
                
			} else {
				handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des modérateurs...");
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des modérateurs...");
		});
    }
    
    getAllUsers(){
        let component = this;
        
        this.setState({users: []});
        
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
                
                if(component.state.firstRequestIsFinished){
                    component.filterUsers();
                } else {
                    component.setState({firstRequestIsFinished: true});
                }
                
			} else {
				handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des utilisateurs...");
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des utilisateurs...");
		});
    }
    
    addAsModerator(idUser) {
        let component = this;
        
        fetch(API_URL + 'rucs?user_id=' + idUser + "&circle_id=" + this.state.circle.id + "&role_name=MODERATOR", {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(ruc){
            if(!ruc){
                handleAPIResult(component, true, "Une erreur est survenue l'ajout du modérateur...");
            } else {
                var changedUser = component.state.users.find(function(user){
                    return user.id == idUser;                            
                });
                
                component.setState({users: component.state.users.filter(function(user) { 
                    return user.id !== idUser;
                })});
                
                var newModerators = component.state.moderators;
                newModerators.push(changedUser);
                component.setState({moderators: newModerators});
            }
        })
        .catch(function(error) {
            console.log(error);
            handleAPIResult(component, true, "Une erreur est survenue l'ajout du modérateur...");
        });
    }
    
    filterUsers(){
        const component = this;
        
        this.setState({users: this.state.users.filter(function(user) {
            for(let i = 0; i < component.state.moderators.length; i++){
                if(component.state.moderators[i].id == user.id)
                    return false;
            }
            return true;
        })});
    }
}

export default ModeratorsModeration;