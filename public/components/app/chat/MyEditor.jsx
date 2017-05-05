import React from 'react';
import {Editor} from 'react-draft-wysiwyg';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }
      
    render() {
        return (
            <Editor id="editor"/>
        );
    }
}