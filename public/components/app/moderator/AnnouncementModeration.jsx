import React from 'react';
import { API_URL, handleAPIResult } from '../../common/Common.jsx';

class AnnouncementModeration extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            announcementMessage : this.props.circle.lines[0].announcement,
            modified : false
        }
        
        this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    render(){
        return (
            <div className="announcement-moderation">
                <textarea id="announcement-input" rows="5" value={this.state.announcementMessage} onChange={this.handleChange} placeholder="Saisir un message d'annonce ..." />
                <div className="row">
                    <button data-open="exampleModal1" onClick={this.handleSubmit} className="button column medium-2">Modifier le message d'annonce</button>
                    {
                        this.state.modified &&
                        <p className="column medium-offset-7 medium-3">Message d'annonce modifié <img  className="check-icon" src="/resource/check.png"/></p>
                    }

                </div>
            </div>
        );
    }
    
    handleSubmit(event) {
		event.preventDefault();
        
        var component = this;
        
        this.setState({
           modified: true
        });
        
        setTimeout(() => { 
            this.setState({modified: false}); 
        }, 8000);
        
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