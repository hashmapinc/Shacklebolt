import React, { Component } from 'react';
import { Auth, API } from 'aws-amplify';

import Results from './results';
import ProgressButton from '../components/progress-button';

export default class Browse extends Component {
    // init state
    state = {
        results: [],
    };

    search = this.search.bind(this);
    async search(tag) {
        let myInit = {
            queryStringParameters: {
                [tag.key]: tag.value
            }
        };
        let files = await API.get('shacklebolt', '/search', myInit);
        console.log(files);
        this.setState({results: files})
    }

    getMyFiles = this.getMyFiles.bind(this);
    async getMyFiles() {
        // get current user
        let user = await Auth.currentAuthenticatedUser();

        // create tag
        const tag =  { key: 'author', value: user.pool.getClientId() };

        // query tags (results are updated in search)
        this.search(tag);
    }
    
    render() {
        return (
            <div className="Browse">
                <h1>Browse</h1>
                <ProgressButton
                    type='button'
                    color="primary"
                    variant='raised'
                    onClick={this.getMyFiles}
                    buttonText="Find my files"
                />
                <Results result={this.state.results}/>
            </div>
        );
    }
}