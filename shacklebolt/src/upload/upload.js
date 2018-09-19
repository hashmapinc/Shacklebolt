import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import FileInput from '../components/file-input'
import TagEditor from '../components/tag-editor'

export default class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = props
    }
    render() {
        return (
            <form className="Upload">
                <header className="App-header">
                    <h1 className="App-title">Upload</h1>
                </header>
                <FileInput/>
                <br/>
                <TagEditor/>
                <br/>
                <Button type='submit' color="primary" variant='raised'>Submit</Button> 
            </form>
        );
    }
}