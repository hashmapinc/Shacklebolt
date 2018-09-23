import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

const fileInputStyle = { 'display': 'none' };

export default class FileInput extends Component {
    constructor(props) {
        super(props);
        this.state = {'inputText' : "Select file ..."};

        this.onFileChange = this.onFileChange.bind(this);
    }

    onFileChange(e) {
        this.setState({'inputText': e.target.files[0].name});
        this.props.onChange(e);
    }

    render() {
        return (
            <div>
                <input
                    id="file-input"
                    type="file"
                    style={fileInputStyle}
                    onChange={this.onFileChange}
                />
                <label htmlFor="file-input">
                    <Button variant="contained" component="span">
                        {this.state.inputText}
                    </Button>
                </label>
            </div>
        );
    }
}
