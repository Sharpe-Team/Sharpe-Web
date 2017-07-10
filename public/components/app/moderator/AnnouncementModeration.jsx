import React from 'react';
import { API_URL, handleAPIResult } from '../../common/Common.jsx';

class AnnouncementModeration extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            announcementMessage : this.props.circle.lines[0].announcement,
        }
        
        this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    render(){
        return (
            <div className="announcement-moderation">
                <textarea id="announcement-input" rows="5" value={this.state.announcementMessage} onChange={this.handleChange} placeholder="Saisir un message d'annonce ..." />
                <button onClick={this.handleSubmit} className="button">Modifier le message d'annonce</button>
            </div>
        );
    }
    
    handleSubmit(event) {
		event.preventDefault();
        
        var component = this;
        
        console.log(this.state.announcementMessage);
        
        fetch(API_URL + 'lines/' + this.props.circle.lines[0].id + '?announcement=' + this.state.announcementMessage, {
			method: 'PUT',
			mode: 'cors',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function(response) { 
            return response.json();
		})
		.then(function(joiningRequest) {
			if(joiningRequest){                
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
    
    handleChange(event) {
        this.setState({
           announcementMessage: event.target.value
        });
    }
}

export default AnnouncementModeration;