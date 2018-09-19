import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

const fileInputStyle = { 'display': 'none' };

export default class FileInput extends Component {
    render() {
        return (
            <div>
                <input
                    id="file-input"
                    type="file"
                    style={fileInputStyle}
                />
                <label htmlFor="file-input">
                    <Button variant="contained" component="span">
                        Select file...
                    </Button>
                </label>
            </div>
        );
    }
}
