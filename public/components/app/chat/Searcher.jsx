import React from 'react';
import { Link, browserHistory } from 'react-router';

class Searcher extends React.Component {
    constructor(props){
        super(props);
        
        this.notifyParent = this.notifyParent.bind(this);
    }
    
    render(){
        return (
            <div id="search" className="row">
                <input className="column medium-12" type="text" onChange={this.notifyParent}/>
            </div>
        );
    }
    
    notifyParent(event) {
		this.props.action(event.target.value);
	}
}

export default Searcher;