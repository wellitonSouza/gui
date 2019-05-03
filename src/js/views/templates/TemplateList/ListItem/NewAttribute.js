/* eslint-disable */
import React, { Component } from 'react';
import TemplateTypes from '../../TemplateTypes';
import util from '../../../../comms/util/util';
import toaster from '../../../../comms/util/materialize';
import { withNamespaces } from 'react-i18next';


const attrType = new TemplateTypes();

class NewAttribute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSuppressed: true,
            isConfiguration: false,
            newAttr: {
                type: '',
                value_type: '',
                value: '',
                label: '',
            },
            isActuator: false,
        };

        this.suppress = this.suppress.bind(this);
        this.availableTypes = attrType.getTypes();
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addAttribute = this.addAttribute.bind(this);
        this.discardAttribute = this.discardAttribute.bind(this);
        this.availableValueTypes = attrType.getValueTypes();
        this.availableTypes = attrType.getTypes();
        this.configValueTypes = attrType.getConfigValueTypes();
        this.configTypes = attrType.getConfigTypes();
    }


    handleChangeStatus(newStatus) {
        this.props.onChangeStatus(newStatus);
    }

    suppress(property) {
        const state = this.state;
        state.isSuppressed = !state.isSuppressed;
        state.isConfiguration = property;
        state.newAttr = {
            value_type: '',
            value: '',
            label: ''
        };
        property === true ? state.newAttr.type = 'meta' : state.newAttr.type = 'dynamic';
        this.setState(state);
        this.handleChangeStatus(property);
    }

    handleChange(event) {
        const target = event.target;
        const state = this.state;
        state.newAttr[target.name] = target.value;
        if (target.value === 'actuator') {
            state.isActuator = true;
        } else if (target.value === 'dynamic' || target.value === 'static') {
            state.isActuator = false;
        }
        this.setState(state);
    }

    addAttribute(attribute) {
        const { t } = this.props;

        let ret = util.isLabelValid(attribute.label);
        if (!ret.result && !this.state.isConfiguration) {
            toaster.error(ret.error);
            return;
        }

        ret = util.isTypeValid(attribute.value, attribute.value_type, attribute.type, this.state.isActuator);
        if (!ret.result) {
            toaster.error(ret.error);
            return;
        }

        // type of attribute can't be empty
        if (attribute.value_type == '') {
            toaster.error(t('templates:alerts.leave_empty'));
            return;
        }

        this.props.addAttribute(attribute, this.state.isConfiguration, this.state.isActuator);
        this.suppress();
    }

    discardAttribute() {
        const state = this.state;
        state.newAttr = {
            type: '',
            value_type: '',
            value: '',
            label: '',
        };
        this.setState(state);
        this.suppress();
    }

    render() {
        const { t } = this.props;

        return (
            <div
                className={`new-attr-area attr-area ${this.state.isSuppressed ? 'suppressed-shadow' : ''}`}>

                <div
                    className={`add-row ${this.state.isSuppressed ? '' : 'invisible zero-height'}`}>
                    <div
                        className="add-btn add-config"
                        onClick={this.suppress.bind(this, true)}
                        title={`${t('add.label')} ${t('templates:btn.new_conf.label')}`}
                    >
                        <div className="icon">
                            <img src="images/add-gear.png"/>
                        </div>
                        <div className="text">
                            <span>configuration</span>
                        </div>
                    </div>
                    <div
                        className="add-btn add-attr"
                        onClick={this.suppress.bind(this, false)}
                        title={`${t('add.label')} ${t('templates:btn.new_attr.label')}`}
                    >
                        <div className="icon">
                            <img src="images/add-tag.png"/>
                        </div>
                        <div className="text">
                            <span>attribute</span>
                        </div>
                    </div>
                    <div className="middle-line"/>
                </div>

                <div className={(this.state.isSuppressed ? 'invisible' : 'padding5')}>
                    <div className={`attr-row ${this.state.isConfiguration ? 'none' : ''}`}>
                        <div className="icon">
                            <img src="images/add-tag.png"/>
                        </div>

                        <div className="attr-content ">
                            <input
                                type="text"
                                value={this.state.newAttr.label}
                                maxLength="25"
                                onChange={this.handleChange}
                                name="label"
                            />
                            <span>{t('name.label')}</span>
                        </div>
                    </div>

                    <div className="attr-row">
                        <div className="icon">
                            <img className={(this.state.isConfiguration ? '' : 'none')}
                                 src="images/add-gear.png"/>
                        </div>
                        <div className="attr-content">
                            <select
                                id="select_attribute_type"
                                className="card-select dark-background"
                                name="value_type"
                                value={this.state.newAttr.value_type}
                                onChange={this.handleChange}
                            >
                                <option value="">Select type</option>
                                {this.state.isConfiguration ? (this.configValueTypes.map(opt =>
                                    <option value={opt.value}
                                            key={opt.label}>{opt.label}</option>)) : (this.availableValueTypes.map(opt =>
                                    <option value={opt.value}
                                            key={opt.label}>{opt.label}</option>))}
                            </select>
                            <span>Type</span>
                        </div>
                    </div>
                    <div className="attr-row">
                        <div className="icon"/>
                        <div className="attr-content">
                            {this.state.isActuator ? null
                                : (
                                    <input
                                        className={(this.state.newAttr.value_type === 'protocol' ? 'none' : '')}
                                        type="text"
                                        value={this.state.newAttr.value}
                                        maxLength="25"
                                        onChange={this.handleChange}
                                        name="value"
                                    />
                                )}

                            <select
                                id="select_attribute_type"
                                className={`${this.state.isConfiguration ? (this.state.newAttr.value_type === 'protocol' ? '' : 'none') : 'none'} card-select dark-background`}
                                name="value"
                                value={this.state.newAttr.value}
                                onChange={this.handleChange}
                            >
                                <option value="">Select type</option>
                                {this.configTypes.map(opt => <option value={opt.value}
                                                                     key={opt.label}>{opt.label}</option>)}
                            </select>

                            <span
                                className={(this.state.isConfiguration ? '' : 'none')}>Value</span>

                            <select
                                id="select_attribute_type"
                                className={`${this.state.isConfiguration ? 'none' : ''} card-select mini-card-select dark-background`}
                                name="type"
                                value={this.state.newAttr.type}
                                onChange={this.handleChange}
                            >
                                <option value="">Select type</option>
                                {this.availableTypes.map(opt => <option value={opt.value}
                                                                        key={opt.label}>{opt.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div
                        className="material-btn center-text-parent"
                        title={`${t('add.label')} ${t('templates:btn.new_attr.label')}`}
                        onClick={this.addAttribute.bind(this, this.state.newAttr)}
                    >
                        <span className="text center-text-child light-text">add</span>
                    </div>
                    <div
                        className="material-btn center-text-parent"
                        title={t('discard.label')}
                        onClick={this.discardAttribute}
                    >
                        <span className="text center-text-child light-text">{t('discard.text')}</span>
                    </div>
                </div>
            </div>

        );
    }
}

export default withNamespaces()(NewAttribute);
