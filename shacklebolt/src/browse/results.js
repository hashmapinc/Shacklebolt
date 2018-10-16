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
    onClick = this.onClick.bind(this);
    async onClick(index) {
        alert("You selected the file: " + JSON.stringify(this.props.results[index]));
    }

    render() {
        const resultItems = this.props.results.map((result, index) =>
            <ListItem 
                button 
                divider 
                key={index} 
                onClick={(e) => this.onClick(index)}
            >
                <ListItemText 
                    primary={result[this.props.textField]} 
                    className={this.props.classes.centerText} 
                />
            </ListItem>
        );

        return (
            <List className={this.props.classes.root}>{resultItems}</List>
        );
    }
}

export default withStyles(styles)(Results);