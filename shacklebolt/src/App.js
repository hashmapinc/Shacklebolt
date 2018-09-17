import React, { Component } from 'react';
import { withAuthenticator } from 'aws-amplify-react';

import Home from './home/home';
import LogoutButton from './components/logout-button';
import CssBaseline from '@material-ui/core/CssBaseline';

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <CssBaseline/>
                <LogoutButton/>
                <Home/>
            </React.Fragment>
        );
    }
}

export default withAuthenticator(App);