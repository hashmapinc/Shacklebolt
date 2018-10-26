import React, { Component } from 'react';

import Tag from './tag';

export default class TagEditor extends Component {
    render() {
        let tags = this.props.tags.map((tag, index) => {
            return (<Tag
                key={index.toString()} // this is a react thing, not a tag key
                tagKey={tag.key}
                tagValue={tag.value}
                keyMsg={tag.keyMsg}
                valueMsg={tag.valueMsg}
                list_index={index}
                onChange={this.props.onChange}
                onRemove={this.props.onRemove}
                reservedKeys={this.props.reservedKeys}
            />)
        });
        return tags;
    }
}