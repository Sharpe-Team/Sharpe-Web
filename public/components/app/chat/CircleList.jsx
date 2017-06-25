import React from 'react';
import { API_URL, hideError, handleAPIResult, displayLoading, getUserFromStorage } from '../../common/Common.jsx';
import Loading from '../../common/Loading.jsx';
import { Link } from 'react-router';
import ErrorComponent from '../../common/ErrorComponent.jsx';

class CircleList extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			circles: [],
			error: {
				showError: false,
				message: ""
			},
			displayLoading: false,
            search: this.props.search
		};

		this.getAllCircles = this.getAllCircles.bind(this);
		this.updateUnreadPointsCircle = this.updateUnreadPointsCircle.bind(this);
		this.updateUnreadPointsCircleFromPoint = this.updateUnreadPointsCircleFromPoint.bind(this);
		this.selectCircle = this.selectCircle.bind(this);
	}

	render() {
		return (
			<div>
				{this.state.displayLoading &&
					<Loading />
				}
				<ul className="navigationList" style={{height: "40%"}}>
					{this.state.error.showError &&
						<ErrorComponent message={this.state.error.message} hideError={hideError.bind(this, this)} />
					}
					{
						this.state.circles.map(function(circle) {
                            if(circle.name.toLowerCase().includes(this.state.search.toLowerCase())) {
                                if(this.props.selectedCircle && this.props.selectedCircle.id == circle.id) {
                                    return (
                                        <div key={circle.id} className="circleListItem">
                                            {   circle['userRole'] == 2 && 
                                                <Link to={'/moderation/'+circle.id}>
                                                    <img className="moderation-button" src="/resource/moderation-button.png"/>
                                                </Link>
                                            }
                                            
                                            <b>{circle.name}</b>
                                            &nbsp;
                                            { circle.nbUnreadPoints > 0 &&
                                            <span className="badge warning">{circle.nbUnreadPoints}</span>
                                            }
                                        </div>
                                    )
                                }
                                return (
                                    <div key={circle.id} onClick={this.selectCircle.bind(this, circle)} className="circleListItem" aria-describedby={"badge_" + circle.id}>
                                        {   circle['userRole'] == 2 && 
                                            <Link to={'/moderation/'+circle.id}>
                                                <img className="moderation-button" src="/resource/moderation-button.png"/>
                                            </Link>
                                        }
                                        {circle.name}
                                        &nbsp;
                                        { circle.nbUnreadPoints > 0 &&
                                        <span id={"badge_" + circle.id} className="badge warning">{circle.nbUnreadPoints}</span>
                                        }
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

		displayLoading(this);
        
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

				let selectedCircle = (circles.length > 0) ? circles[0] : null;

				for(let i=0; i<circles.length; i++) {
					circles[i]['nbUnreadPoints'] = 0;
				}
                
                var rucs = getUserFromStorage().ruc;
                
                for(let i=0; i<circles.length; i++) {
                    for(let j=0; j<rucs.length; j++){
                        if(rucs[j].idCircle == circles[i].id){
                            circles[i]['userRole'] = rucs[j].idRole;
                        }
                    }
                }

				component.setState({
					circles: circles
				});

				component.props.updateSelectedCircle(selectedCircle);
			} else {
				handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des cercles...");
			}
		})
		.catch(function(error) {
			console.log(error);
			handleAPIResult(component, true, "Une erreur est survenue lors de la récupération des cercles...");
		});
	}

	selectCircle(circle) {
		let circles = this.state.circles;

		// Find the circle that needs to be updated in the list of circles
		let indexCircle = circles.findIndex(function(element) {
			return element.id == circle.id;
		});

		this.updateUnreadPointsCircle(indexCircle, true);

		this.props.updateSelectedCircle(circles[indexCircle]);
	}

	updateUnreadPointsCircleFromPoint(point, defaultValue) {
		// Find the circle that needs to be updated in the list of circles
		let indexCircle = this.state.circles.findIndex(function(circle) {
			return circle.lines.find(function(line) {
				return line.id == point.idLine;
			});
		});

		this.updateUnreadPointsCircle(indexCircle, defaultValue);
	}

	updateUnreadPointsCircle(indexCircle, defaultValue) {
		if(indexCircle >= 0) {
			let circles = this.state.circles;

			if(defaultValue) {
				circles[indexCircle].nbUnreadPoints = 0;
			} else {
				circles[indexCircle].nbUnreadPoints++;
			}

			this.setState({
				circles: circles
			});
		}
	}
}

export default CircleList;