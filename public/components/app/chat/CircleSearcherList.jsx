import React from 'react';
import { API_URL, handleAPIResult } from '../../common/Common.jsx';

class CircleSearcherList extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			circles: [],
            search: this.props.search
		};

		this.getAllCircles = this.getAllCircles.bind(this);
    }
    
    render() {
		return (
			<div>
				<ul >
					{
						this.state.circles.map(function(circle) {
                            if(circle.name.toLowerCase().includes(this.state.search.toLowerCase())) {
                                return (
                                    <div key={circle.id}>
                                        {circle.name}
                                    </div>
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
}

export default CircleSearcherList;