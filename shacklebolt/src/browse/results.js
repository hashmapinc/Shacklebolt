import React, { Component } from 'react';
import { Storage } from 'aws-amplify';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

import ConfirmDialog from '../components/confirm-dialog';

const styles = {
    centerText: {
        textAlign: 'center',
    },
    root: {
        padding: '10vw',
    },
};

class Results extends Component {
    // init state
    state = {
        dialogIsOpen: false,
        dialogTitle: "Confirm file download?",
        dialogContent: "",
        clickedIndex: -1,
    }

    onClick = this.onClick.bind(this);
    async onClick(index) {
        const selectedItem = this.props.results[index][this.props.textField];
        const msg = <span>{"Would you like to download the following file: "} <strong>{selectedItem}</strong>?</span>;
        this.setState({
            dialogIsOpen: true,
            dialogContent: msg,
            clickedIndex: index,
        });
    }

    onDialogCancel = this.onDialogCancel.bind(this);
    onDialogCancel() {
        this.setState({
            dialogIsOpen: false,
            dialogContent: "",
            clickedIndex: -1,
        });
    }

    onDialogConfirm = this.onDialogConfirm.bind(this);
    async onDialogConfirm() {
        const s3_key = this.props.results[this.state.clickedIndex].s3_key;
        this.setState({
            dialogIsOpen: false,
            dialogContent: "",
            clickedIndex: -1,
        });

        // download file
        Storage.get(s3_key)
            .then(result => {
                window.open(result);
            })
            .catch(err => console.log(err));
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
            <React.Fragment>
                <List className={this.props.classes.root}>{resultItems}</List>
                <ConfirmDialog
                    isOpen={this.state.dialogIsOpen}
                    cancelHandler={this.onDialogCancel}
                    confirmHandler={this.onDialogConfirm}
                    title={this.state.dialogTitle}
                >{this.state.dialogContent}</ConfirmDialog>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Results);