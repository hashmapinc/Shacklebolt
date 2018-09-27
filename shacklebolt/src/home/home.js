import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import LogoutButton from '../components/logout-button';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.grow = {
      flexGrow: 1,
    }
  }
  render() {
    return (
      <div className='root'>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="title" color="inherit" style={this.grow} align='left'>
              Shacklebolt
            </Typography>
            <LogoutButton/>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}