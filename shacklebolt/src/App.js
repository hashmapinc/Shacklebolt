import React, { Component } from 'react';
import { withAuthenticator } from 'aws-amplify-react';

import Home from './home/home';
import Browse from './browse/browse';
import Upload from './upload/upload';
import LogoutButton from './components/logout-button';
import CssBaseline from '@material-ui/core/CssBaseline';

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <CssBaseline/>
                <LogoutButton/>
                <Home/>
                <br />
                <br/>
                <Browse />
                <br />
                <br />
                <Upload />
            </React.Fragment>
        );
    }
}

export default withAuthenticator(App);