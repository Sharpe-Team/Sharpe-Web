import React from 'react';
import { Link } from 'react-router';
import Searcher from './Searcher.jsx';
import CircleSearcherList from './CircleSearcherList.jsx';

class CircleSearcher extends React.Component {
    
    constructor(props) {
		super(props);

		this.state = {
            search: ""
		};

        this.searchHandler = this.searchHandler.bind(this);
	}
    
    render() {
        return (
            <div className="circle-searcher-page">
                <div className="row">
                    <Link to="/app" className="medium-1"><img className="home-button" src="/resource/home-button.png"></img></Link>
                    <div className="circle-search-input offset-1 medium-10">
                         <Searcher action={this.searchHandler}/>
                    </div>        
                </div>
                <div className="circle-list-panel">
                    <CircleSearcherList search={this.state.search}/>
                </div>
            </div>
            
        );
    }
    
    searchHandler(search){
        this.setState({
            search: search
        });
    }
}

export default CircleSearcher;