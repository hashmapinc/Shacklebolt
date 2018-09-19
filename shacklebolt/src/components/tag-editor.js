import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';

export default class TagEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {tags: ''}
    }
    render() {
        return (
            <TextField
                id="tag-editor"
                label="Metadata JSON"
                multiline
                value={this.state.multiline}
                variant="outlined"
            />
        );
    }
}