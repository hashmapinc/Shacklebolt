import React, { Component } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    centerText: {
        textAlign: 'center',
    },
    root: {
        padding: '10vw',
    },
};

class Results extends Component {
    render() {
        const resultItems = this.props.results.map((result) =>
            <ListItem button divider key={result} >
                <ListItemText primary={result} className={this.props.classes.centerText} />
            </ListItem>
        );

        return (
            <List className={this.props.classes.root}>{resultItems}</List>
        );
    }
}

export default withStyles(styles)(Results);