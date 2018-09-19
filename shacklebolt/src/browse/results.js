import React, { Component } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export default class Results extends Component {
    render() {
        const resultItems = this.props.results.map((result) =>
            <ListItem button>
                <ListItemText primary={result} />
            </ListItem>
        );

        return (
            <List>{resultItems}</List>
        );
    }
}