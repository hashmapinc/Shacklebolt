import React, { Component } from 'react';
import {Storage, Auth, API} from 'aws-amplify';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import ENV from '../environment-variables';
import FileInput from '../components/file-input';
import TagEditor from './tag-editor';
import {getDynamoClient} from '../storage/dynamo-client';
import ProgressButton from '../components/progress-button';

const styles = {
    tagEditorContainer: {
        paddingLeft: '20vw',
        paddingRight: '20vw',
    },
};

class Upload extends Component {
    // init state
    state = {
        tags: [],
        isDisabled: true,
    };

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
            if (err) alert(err, err.stack);
        });
    }

    /**
     * submits the new file for upload
     */
    onSubmit = this.onSubmit.bind(this); // bind this
    async onSubmit() {
        // validate input
        let errors = [];
        this.state.tags.forEach(tag => {
            if (tag.keyMsg) {
                errors.push(tag.keyMsg);
            }
            if (tag.valueMsg) {
                errors.push(tag.valueMsg);
            }
            if (tag.key === '' || tag.value === '') {
                errors.push('No empty tags/values allowed');
            }
        });

        if (errors.length !== 0) {
            alert("Error in tags: \n" + errors.toString());
            return;
        }

        // no errors, handle the submit.
        // get current user
        let user = await Auth.currentAuthenticatedUser();

        let myInit = {
            queryStringParameters: {
                author: user.pool.getClientId()
            }
        }
        let re = await API.get('shacklebolt', '/search', myInit);
        console.log(re);

        // preprocess some data
        const file = this.state.currentFile;
        const groupName = await API.get('shacklebolt', '/group');
        const filename = file.name;
        const s3_key = groupName + '/' + file.name; // TODO: change this to a UUID at some point
        let tags = this.state.tags.concat([
            { key: 'filename', value: filename, },
            { key: 'filetype', value: file.type, },
            { key: 'created', value: Date.now().toString(), },
            { key: 'author', value: user.pool.getClientId() },
        ]);
        
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
    }

    /**
     * update state with new file
     * 
     * @param {event} e - the on change event
     */
    onFileChange = this.onFileChange.bind(this); // bind this
    onFileChange(e) {
        const file = e.target.files[0];
        this.setState({ currentFile: file, isDisabled: false });
    }

    /**
     * when any tag value changes, this is called to update state
     * 
     * @param {Number} index - index in the tags array to place the update
     * @param {key, value, keyMsg, valueMsg} tag - updated tag
     */
    onTagChange = this.onTagChange.bind(this);
    onTagChange(index, tag) {
        this.setState((prev_state, prev_props) => {
            let tags = prev_state.tags;

            if (tag.key !== undefined) {
                tags[index].key = tag.key
            }
            if (tag.value !== undefined) {
                tags[index].value = tag.value
            }
            if (tag.keyMsg !== undefined) {
                tags[index].keyMsg = tag.keyMsg
            }
            if (tag.valueMsg !== undefined) {
                tags[index].valueMsg = tag.valueMsg
            }

            return { tags: tags};
        });
    }

    /**
     * adds a new tag entry into the tags array in state
     */
    addTag = this.addTag.bind(this);
    addTag(){
        this.setState((prevState, prevProps) => {
            let tags = prevState.tags;
            let newTag = { key: '', value: '', keyMsg: '', valueMsg: '' };
            tags.push(newTag);
            return {tags: tags}
        });
    }

    render() {
        return (
            <form className="Upload">
                <header className="App-header">
                    <h1 className="App-title">Upload</h1>
                </header>
                <FileInput 
                    onChange={this.onFileChange}
                />
                <br/>
                <div className={this.props.classes.tagEditorContainer}>
                    <TagEditor
                        onChange={this.onTagChange}
                        tags={this.state.tags}
                    />
                    <br />
                    <Button
                        type='button'
                        color="primary"
                        variant='raised'
                        onClick={this.addTag}>
                        Add Tag
                    </Button>
                </div>
                
                <br/>
                <br/>
                <ProgressButton 
                    type='button' 
                    color="primary" 
                    variant='raised'
                    disabled={this.state.isDisabled}
                    onClick={this.onSubmit}
                    buttonText="Submit"
                />
            </form>
        );
    }
}

export default withStyles(styles)(Upload);