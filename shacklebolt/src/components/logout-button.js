import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import { Auth } from 'aws-amplify';

export default class LogoutButton extends Component {
    constructor(props) {
        super(props);

        // This binding is necessary to make `this` work in the callback
        this.logout = this.logout.bind(this);
    }

    render() {
        return (
            <Button variant="contained" color="primary" onClick={this.logout}>
                Logout
            </Button>
        );
    }

    logout() {
        Auth.signOut()
            .then(data => {
                console.log(data);
                window.location.reload();
            })
            .catch(err => console.log(err));
    }
}