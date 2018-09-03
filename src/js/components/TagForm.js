/**
  Reusable form for entity tags.

  Uses TagActions to manipulate the list of tags.
 */

import React, { Component } from 'react';
import TagActions from '../actions/TagActions';

class TagForm extends Component {
    constructor(props) {
        super(props);

        this.state = { tag: '' };
        this.tagChange = this.tagChange.bind(this);
        this.addTag = this.addTag.bind(this);
    }

    tagChange(event) {
        event.preventDefault();
        this.setState({ tag: event.target.value });
    }

    addTag(event) {
        event.preventDefault();
        const trimmed = this.state.tag.trim();
        if (trimmed.length == 0) {
            TagActions.error('Invalid tag name');
        } else {
            TagActions.add(trimmed);
            this.setState({ tag: '' });
        }
    }

    render() {
        return (
            <span className="tags-form">
                <div className="row">
                    <div className="col s11">
                        <div className="input-field">
                            <label htmlFor="fld_newTag">Add a new tag</label>
                            <input
                                id="fld_newTag"
                                type="text"
                                value={this.state.tag}
                                onChange={this.tagChange}
                            />
                        </div>
                    </div>
                    <div className="col s1">
                        <div
                            title="Add tag"
                            className="btn btn-item btn-floating waves-effect waves-light cyan darken-2"
                            onClick={this.addTag}
                        >
                            <i className="fa fa-plus" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="wrapping-list">
                        {/* { this.props.tags.map((tag) =>( */}
                        {/* <div key={tag}> */}
                        {/* {tag} &nbsp; */}
                        {/* <a title="Remove tag" className="btn-item clickable" */}
                        {/* onClick={(e) => {e.preventDefault(); TagActions.remove(tag)}}> */}
                        {/* <i className="fa fa-times" aria-hidden="true"></i> */}
                        {/* </a> */}
                        {/* </div> */}
                        {/* ))} */}
                    </div>
                </div>
            </span>
        );
    }
}

export default TagForm;
