import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const RESERVED_KEYS = [
    'filename',
    'filetype',
    'created',
    'author',
];

const isAlphaNumeric = input => {
    let isJustSpaces = input.match(/^[ ]+$/i) !== null
    return !isJustSpaces && input.match(/^[a-z0-9 ]+$/i) !== null;
}

const styles = {
    container: {
    },
    key: {
        width: '50%',
        padding: '10px',
    },
    value: {
        width: '50%',
        padding: '10px',
    },
};


class Tag extends Component {
    validateKey = this.validateKey.bind(this);
    validateKey(tag_key) {
        if (tag_key === "") {
            this.props.onChange(this.props.list_index, {keyMsg: ''});
            return true;
        }

        if (!isAlphaNumeric(tag_key)) {
            this.props.onChange(this.props.list_index, {keyMsg: 'must be alphanumeric.'});
            return false;
        }
        
        if (RESERVED_KEYS.includes(tag_key.toLowerCase())) {
            this.props.onChange(this.props.list_index, { keyMsg: tag_key + ' is a reserved keyword' });
            return false;
        }

        this.props.onChange(this.props.list_index, { keyMsg: '' });
        return true;
    }

    onKeyUpdate = this.onKeyUpdate.bind(this);
    onKeyUpdate(e) {
        let newKey = e.target.value;
        this.props.onChange(this.props.list_index, {'key': newKey});
        this.validateKey(newKey);
    }

    validateValue = this.validateValue.bind(this);
    validateValue(tag_value) {
        if (isAlphaNumeric(tag_value)) {
            this.props.onChange(this.props.list_index, { 'valueMsg': '' });
            return true;
        } else {
            this.props.onChange(this.props.list_index, { 'valueMsg': 'Tag values must be alphanumeric' });
            return false;
        }

    }

    onValueUpdate = this.onValueUpdate.bind(this);
    onValueUpdate(e) {
        let newValue = e.target.value;
        this.props.onChange(this.props.list_index, { 'value': newValue });
        this.validateValue(newValue);
    }

    render() {
        return (
            <div className={this.props.classes.container}>
                <TextField
                    error={this.props.keyMsg !== ''}
                    label="Tag Key" 
                    value={this.props.tagKey}
                    variant="outlined"
                    className={this.props.classes.key}
                    onChange={this.onKeyUpdate}
                />
                <TextField
                    label="Tag Value"
                    error={this.props.valueMsg !== ''}
                    value={this.props.tagValue}
                    variant="outlined"
                    className={this.props.classes.value}
                    onChange={this.onValueUpdate}
                />
                
            </div>
        );
    }
}

export default withStyles(styles)(Tag);