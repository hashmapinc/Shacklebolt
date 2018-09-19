import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';

import Results from './results';

export default class Browse extends Component {
    render() {
        return (
            <div className="Browse">
                <h1>Browse</h1>
                <TextField
                    id="standard-search"
                    label="Search..."
                    type="search"
                    margin="normal"
                />
                <Results results={[]}/>
            </div>
        );
    }
}