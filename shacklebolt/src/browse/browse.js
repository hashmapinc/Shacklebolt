import React, { Component } from 'react';
import { Auth, API } from 'aws-amplify';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';

import Results from './results';
import ProgressButton from '../components/progress-button';
import TagEditor from '../components/tags/tag-editor';

const styles = {
    tagEditorContainer: {
        paddingLeft: '20vw',
        paddingRight: '20vw',
    },
    buttons: {
        margin: '20px'
    }
};

class Browse extends Component {
    // init state
    state = {
        results: [],
        tagEditorIsHidden: true,
        tags: []
    };

    search = this.search.bind(this);
    async search(tags) {
        let queryStringParams = {};
        tags.forEach(tag => {
            queryStringParams[tag.key] = tag.value;
        });
        let myInit = {
            queryStringParameters: queryStringParams
        };
        let files = await API.get('shacklebolt', '/search', myInit);
        console.log("Found files: " + JSON.stringify(files))
        this.setState({results: files});
    }

    getMyFiles = this.getMyFiles.bind(this);
    async getMyFiles() {
        // get current user
        let user = await Auth.currentAuthenticatedUser();

        // create tag
        const tags =  [{ key: 'author', value: user.username }];

        // query tags (results are updated in search)
        this.search(tags);
    }

    searchByTag = this.searchByTag.bind(this);
    async searchByTag(e) {
        // create tag
        let tags = this.state.tags;

        // query tags (results are updated in search)
        this.search(tags);
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

            return { tags: tags };
        });
    }

    /**
     * when any tag is removed from the editor, this is called to update state
     * 
     * @param {Number} index - index in the tags array to remove the tag entry
     */
    onTagRemove = this.onTagRemove.bind(this);
    onTagRemove(index) {
        this.setState((prev_state, prev_props) => {
            let tags = prev_state.tags;

            // remove 1 element from index=index
            tags.splice(index, 1); // modifies tags in place

            return { tags: tags };
        });
    }

    /**
     * add an empty tag to the tags array
     */
    addTag = this.addTag.bind(this);
    addTag() {
        this.setState((prev_state, prev_props) => {
            let tags = prev_state.tags;
            tags.push({
                'key': '',
                'value': '',
                'keyMsg': '',
                'keyMsg': '',
            })

            return { tags: tags };
        });
    }
    
    render() {
        return (
            <div>
                <h1>Browse</h1>
                <Grid 
                    container
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={12}>
                        <ProgressButton
                            className={this.props.classes.buttons}
                            type='button'
                            color="primary"
                            variant='raised'
                            onClick={this.getMyFiles}
                            buttonText="Find my files"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TagEditor
                            onChange={this.onTagChange}
                            onRemove={this.onTagRemove}
                            tags={this.state.tags}
                            reservedKeys={[]}
                        />
                        <Button
                            hidden={this.state.tags.length === 0}
                            className={this.props.classes.buttons}
                            type='button'
                            color="primary"
                            variant='raised'
                            onClick={this.addTag}
                            >
                            Add tag filter
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <ProgressButton
                            className={this.props.classes.buttons}
                            disabled={this.state.tags.length === 0}
                            type='button'
                            color="primary"
                            variant='raised'
                            onClick={this.searchByTag}
                            buttonText="Search"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Results 
                            results={this.state.results} 
                            textField={"filename"}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(Browse)