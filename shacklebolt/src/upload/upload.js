import React, { Component } from 'react';
import {Storage} from 'aws-amplify';

import Button from '@material-ui/core/Button';

import FileInput from '../components/file-input'
import TagEditor from '../components/tag-editor'

export default class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {tags: {}, isDisabled: true};
        this.onSubmit = this.onSubmit.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
    }

    onSubmit() {
        Storage.put(this.state.currentFile.name, this.state.currentFile, {
            contentType: this.state.currentFile.type
        }).then(
            result => console.log(result)
        ).catch(
            err => console.log(err)
        );
    }

    onFileChange(e) {
        const file = e.target.files[0];
        this.setState({currentFile: file, isDisabled: false});
    }

    render() {
        return (
            <form className="Upload">
                <header className="App-header">
                    <h1 className="App-title">Upload</h1>
                </header>
                <FileInput onChange={this.onFileChange}/>
                <br/>
                <TagEditor/>
                <br />
                <br/>
                <Button 
                    type='button' 
                    color="primary" 
                    variant='raised'
                    disabled={this.state.isDisabled}
                    onClick={this.onSubmit}>
                    Submit
                </Button> 
            </form>
        );
    }
}