import React from 'react';

class CircleHeader extends React.Component {
    constructor(props) {
		super(props);
    }
    
    render(){
        return (
            <div className="expanded row" style={{height: this.props.navbarHeight + "px"}}>
                <div id="profile" className="column medium-6">
                    <div className="row">
                        <div className="column medium-3" style={{height: "100%"}}>
                            <div className="circularImageContainer">
                                { this.props.circle.pictureUrl &&
                                    <img className="profilePicture" src={'uploads/' + this.props.circle.pictureUrl}/>
                                }
                            </div>
                        </div>
                        <div className="column medium-9" style={{height: "100%"}}>
                            <h2 className="circleTitle">{this.props.circle.name}</h2>
                        </div>
                    </div>
                </div>
                <div id="banner" className="column medium-6">
                    { this.props.circle.bannerPictureUrl &&
                        <img className="bannerPicture" src={'uploads/' + this.props.circle.bannerPictureUrl}/>
                    }
                </div>
            </div>
        );
    }
}

export default CircleHeader;


