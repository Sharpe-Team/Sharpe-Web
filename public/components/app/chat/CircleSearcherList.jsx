import React from 'react';
import { API_URL, handleAPIResult, getUserFromStorage } from '../../common/Common.jsx';

class CircleSearcherList extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			circles: [],
            search: this.props.search
		};

		this.getAllCircles = this.getAllCircles.bind(this);
        this.isNotLinked = this.isNotLinked.bind(this);
    }
    
    render() {
		return (
			<div>
				<ul id="circle-search">
					{
						this.state.circles.map(function(circle) {
                            if(circle.name.toLowerCase().includes(this.state.search.toLowerCase())) {
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
                                            {
                                                this.isNotLinked(circle.id) &&
                                                <a className="button tiny join-button column medium-1">Rejoindre</a>
                                            }
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
        
        return true;
    }
}

export default CircleSearcherList;