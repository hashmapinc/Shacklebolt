import React, { Component } from 'react';
import {Storage, Auth, API} from 'aws-amplify';

import Button from '@material-ui/core/Button';

import ENV from '../environment-variables';
import FileInput from '../components/file-input';
import TagEditor from '../components/tag-editor';
import {getDynamoClient} from '../storage/dynamo-client';

export default class Upload extends Component {
    // init state
    state = { tags: {}, isDisabled: true };

    /**
     * saves the tag entry into dynamo
     * 
     * @param {string} s3_key - path to the file in s3
     * @param {object} tag - object with key and value to save
     */
    async saveTag(s3_key, tag) {
        // create put params
        const params = {
            'Item': {
                "tag_key": tag.key,
                "s3_key": s3_key,
                "tag_value": tag.value,
            },
            'TableName': ENV.TAGS_TABLENAME,
        };

        // get client
        const dynamodb = await getDynamoClient();

        // put item
        dynamodb.put(params, function (err, data) {
            if (err) console.log(err, err.stack);
        });
    }

    onSubmit = this.onSubmit.bind(this); // bind this
    onSubmit() {
        // async handler
        (async () => {
            // get current user
            let user = await Auth.currentAuthenticatedUser();

            // preprocess some data
            const file = this.state.currentFile;
            const groupName = await API.get('shacklebolt', '/group');
            const filename = file.name;
            const s3_key = groupName + '/' + file.name; // TODO: change this to a UUID at some point
            let tags = [ // TODO: let the user add tag key/values 
                { key: 'filename', value: filename, },
                { key: 'filetype', value: file.type, },
                { key: 'created', value: Date.now().toString(), },
                { key: 'author', value: user.pool.getClientId() },
            ];

            // store the file in s3
            try {
                await Storage.put(s3_key, file, {
                    contentType: file.type
                });
                console.log('successfully stored file in s3 with key=' + s3_key);
            } catch(err) {
                console.log("error trying to store file in s3: ");
                return err;
            }

            // index the tags in dynamo
            tags.forEach(tag => {
                let tagstring = JSON.stringify(tag);
                this.saveTag(s3_key, tag).then(result => {
                    console.log('successfully indexed file in dynamo with the tag: ' + tagstring);
                }).catch(err => {
                    console.log("could not index tag: " + tagstring);
                    console.log(err);
                });
            });
        })().catch(err => console.log(err));
    }

    onFileChange = this.onFileChange.bind(this); // bind this
    onFileChange(e) {
        const file = e.target.files[0];
        this.setState({currentFile: file, isDisabled: false});
    }

    render() {
        return (
            <form className="Upload">
                <header className="App-header">
                    <h1 className="App-title">Upload</h1>
                </header>
                <FileInput onChange={this.onFileChange}/>
                <br/>
                <TagEditor/>
                <br />
                <br/>
                <Button 
                    type='button' 
                    color="primary" 
                    variant='raised'
                    disabled={this.state.isDisabled}
                    onClick={this.onSubmit}>
                    Submit
                </Button> 
            </form>
        );
    }
}