/* eslint-disable */
import React, { Component } from 'react';
import TemplateTypes from '../../TemplateTypes';

const attrType = new TemplateTypes();

class AttributeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSuppressed: true,
            fieldSizeDyAttrStatus: false,
            fieldSizeStaticAttrStatus: false,
        };

        this.suppress = this.suppress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.removeAttribute = this.removeAttribute.bind(this);
        this.availableValueTypes = attrType.getValueTypes();
        this.availableTypes = attrType.getTypes();
    }

    componentWillMount() {
        if (this.props.attributes.label.length > 18) {
            this.setState({ fieldSizeDyAttrStatus: true });
        }

        if (this.props.attributes.hasOwnProperty('static_value')) {
            if (this.props.attributes.static_value.length > 18) {
                this.setState({ fieldSizeStaticAttrStatus: true });
            }
        }
    }

    suppress() {
        this.setState({ isSuppressed: !this.state.isSuppressed });
    }

    handleChange(event) {
        this.props.onChangeValue(event, this.props.index);
    }

    removeAttribute(attribute) {
        this.props.removeAttribute(attribute, false);
    }

    render() {
        const staticValue = this.props.attributes.static_value || '';
        return (
            <div className={`attr-area ${this.state.isSuppressed ? 'suppressed' : ''}`}>
                <div className="attr-row">
                    <div className="icon">
                        <img src="images/tag.png" />
                    </div>
                    <div className="attr-content">
                        <input
                            className={this.state.fieldSizeDyAttrStatus ? 'truncate' : ''}
                            type="text"
                            value={this.props.attributes.label}
                            disabled={!this.props.editable}
                            name="label"
                            onChange={this.handleChange}
                            maxLength="25"
                            title={this.props.attributes.label}
                        />
                        <span>Name</span>
                    </div>
                    <div className="center-text-parent material-btn right-side" onClick={this.suppress}>
                        <i className={`${this.state.isSuppressed ? 'fa fa-angle-down' : 'fa fa-angle-up'} center-text-child text`} />
                    </div>
                </div>
                <div className="attr-row">
                    <div className="icon" />
                    <div className="attr-content">
                        <select
                            id="select_attribute_type"
                            className="card-select"
                            name="value_type"
                            value={this.props.attributes.value_type}
                            disabled={!this.props.editable}
                            onChange={this.handleChange}
                        >
                            <option value="">Select type</option>
                            {this.availableValueTypes.map(opt => <option value={opt.value} key={opt.label}>{opt.label}</option>)}
                        </select>

                        <span>Type</span>
                    </div>
                    <div
                        className={`${this.props.editable ? '' : 'none'} center-text-parent material-btn right-side raised-btn`}
                        title="Remove Attribute"
                        onClick={this.removeAttribute.bind(this, this.props.index)}
                    >
                        <i className="fa fa-trash center-text-child icon-remove" />
                    </div>
                </div>
                <div className="attr-row">
                    <div className="icon" />
                    <div className="attr-content">
                        <input
                            className={this.state.fieldSizeStaticAttrStatus ? 'truncate' : ''}
                            type="text"
                            value={staticValue}
                            disabled={!this.props.editable}
                            name="static_value"
                            onChange={this.handleChange}
                            maxLength="25"
                            title={staticValue}
                        />
                        <select
                            id="select_attribute_type"
                            className="card-select mini-card-select"
                            name="type"
                            value={this.props.attributes.type}
                            disabled={!this.props.editable}
                            onChange={this.handleChange}
                        >
                            <option value="">Select type</option>
                            {this.availableTypes.map(opt => <option value={opt.value} key={opt.label}>{opt.label}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}

export default AttributeList;
