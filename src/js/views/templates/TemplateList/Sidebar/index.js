import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import toaster from 'Comms/util/materialize';
import TemplateActions from 'Actions/TemplateActions';
import util from 'Comms/util/util';
import SidebarTemplate from './SidebarTemplate/index';
import SidebarAttribute from './SidebarAttribute/index';
import SidebarMetadata from './SidebarMetadata/index';
import { templateType, tempOpxType } from '../../TemplatePropTypes';

class Sidebar extends Component {
    static createAttribute() {
        return {
            id: `${Math.floor(Math.random() * 100000)}`,
            label: '',
            type: '',
            value_type: '',
            static_value: '',
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            template: {},
            metadata: {},
            showAttribute: false,
            showMetadata: false,
            selectAttr: {},
            newAttr: false,
            showDeleteTemplate: false,
            showDeleteAttr: false,
            showDeleteMeta: false,
            isNewMetadata: false,
            isNewTemplate: false,
        };

        this.toogleSidebarAttribute = this.toogleSidebarAttribute.bind(this);
        this.toogleSidebarMetadata = this.toogleSidebarMetadata.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.changeAttrValue = this.changeAttrValue.bind(this);
        this.updateTemplateAttr = this.updateTemplateAttr.bind(this);
        this.addTemplateAttr = this.addTemplateAttr.bind(this);
        this.saveTemplate = this.saveTemplate.bind(this);
        this.updateTemplate = this.updateTemplate.bind(this);
        this.addMetadata = this.addMetadata.bind(this);
        this.handleChangeMetadata = this.handleChangeMetadata.bind(this);
        this.validateAttrs = this.validateAttrs.bind(this);
        this.deleteTemplate = this.deleteTemplate.bind(this);
        this.toogleSidebarDelete = this.toogleSidebarDelete.bind(this);
        this.removeSelectAttr = this.removeSelectAttr.bind(this);
        this.removeSelectMeta = this.removeSelectMeta.bind(this);
        this.selectMetadata = this.selectMetadata.bind(this);
        this.updateMetadata = this.updateMetadata.bind(this);
        this.validateMetadata = this.validateMetadata.bind(this);
    }

    componentDidMount() {
        const { template } = this.props;
        this.setState({
            template,
            metadata: {
                label: '',
                type: '',
                value_type: '',
                static_value: '',
            },
            showAttribute: false,
            showMetadata: false,
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            template: nextProps.template,
            showAttribute: false,
            showMetadata: false,
        });
    }

    toogleSidebarAttribute(attrType, attr = Sidebar.createAttribute()) {
        const { showAttribute } = this.state;
        this.setState({
            showAttribute: !showAttribute,
            showMetadata: false,
            selectAttr: { ...attr, attrType },
            newAttr: attr.label.length === 0,
        });
    }

    toogleSidebarMetadata(metadata) {
        const { showMetadata } = this.state;
        if (metadata) {
            this.setState({
                showMetadata: !showMetadata,
                metadata,
                isNewMetadata: false,
            });
        } else {
            const newMeta = Sidebar.createAttribute();
            this.setState({
                showMetadata: !showMetadata,
                metadata: newMeta,
                isNewMetadata: true,
            });
        }
    }

    changeValue(field, event) {
        const { template } = this.state;
        template[field] = event.target.value;
        this.setState({
            template,
        });
    }

    changeAttrValue(event, attr) {
        const values = { ...attr };
        values[event.target.name] = event.target.value;
        this.setState({
            selectAttr: values,
        });
    }

    updateTemplateAttr(attrs) {
        if (!this.validateAttrs(attrs, false)) return;

        const { template } = this.state;
        const [type, values] = [attrs.attrType, { ...attrs }];

        if (type === 'config_attrs') {
            values.value_type = 'string';
            values.type = 'meta';
        }
        if (values.type === 'dynamic') values.static_value = '';

        template[type] = template[type].map((item) => {
            if (item.id === values.id) {
                delete values.attrType;
                return values;
            }
            return item;
        });

        this.setState({
            showAttribute: false,
            template,
        });
    }

    addTemplateAttr(attrs) {
        if (!this.validateAttrs(attrs, true)) return;

        const { template } = this.state;
        const [type, values] = [attrs.attrType, { ...attrs }];

        if (type === 'config_attrs') {
            values.value_type = 'string';
            values.type = 'meta';
        }
        if (values.type === 'dynamic') values.static_value = '';

        delete values.attrType;
        template[type].push(values);

        this.setState({
            showAttribute: false,
            template,
        });
    }

    validateAttrs(attrs, isNew = false) {
        const { template } = this.state;
        const [type, values] = [attrs.attrType, { ...attrs }];

        const ret = util.isNameValid(values.label);
        if (!ret.result) {
            toaster.error(ret.error);
            return false;
        }

        // verify if attr name already exists
        const existName = template[type].some(
            item => item.label === values.label && item.id !== values.id,
        );
        if (existName) {
            toaster.warning(`The label '${values.label}' is already created.`);
            return false;
        }

        if (type === 'config_attrs') values.value_type = 'string';
        if (values.type === 'dynamic') values.static_value = '';

        if (type === 'config_attrs') {
            if (template[type].some(item => item.label === values.label && isNew)) {
                toaster.warning(`Configuration ${values.label} already exists`);
                return false;
            }
        }

        if (values.value_type.trim().length === 0) {
            toaster.error('You must set a type.');
            return false;
        }

        const resp = util.isTypeValid(values.static_value, values.value_type, values.type);
        if (!resp.result) {
            toaster.error(resp.error);
            return false;
        }

        return true;
    }

    saveTemplate() {
        const { toogleSidebar, temp_opex } = this.props;
        const { template } = this.state;

        const ret = util.isNameValid(template.label);
        if (!ret.result) {
            toaster.error(ret.error);
            return;
        }

        template.attrs = [];
        template.attrs.push(...template.data_attrs);
        template.attrs.push(...template.config_attrs);
        template.attrs = this.removeIds(template.attrs);
        TemplateActions.addTemplate(template, () => {
            toaster.success('Template created.');
            TemplateActions.removeSingle('new_template');
            toogleSidebar();
            temp_opex._fetch();
        });
    }

    updateTemplate() {
        const { template } = this.state;
        const { toogleSidebar, temp_opex } = this.props;

        // Verify template name
        const ret = util.isNameValid(template.label);
        if (!ret.result) {
            toaster.error(ret.error);
            return;
        }

        template.attrs = [];
        template.attrs.push(...template.data_attrs);
        template.attrs.push(...template.config_attrs);
        template.attrs = this.removeIds(template.attrs);
        TemplateActions.triggerUpdate(template, () => {
            toaster.success('Template updated');
            toogleSidebar();
            temp_opex._fetch();
        });
    }

    addMetadata() {
        const { metadata, selectAttr, showMetadata } = this.state;
        if (!this.validateMetadata(metadata)) return;

        if (!Object.prototype.hasOwnProperty.call(selectAttr, 'metadata')) selectAttr.metadata = [];

        selectAttr.metadata.push({ ...metadata });
        this.setState({
            showMetadata: !showMetadata,
            selectAttr,
        });
    }

    updateMetadata() {
        const { metadata, selectAttr, showMetadata } = this.state;
        if (!Object.prototype.hasOwnProperty.call(selectAttr, 'metadata')) selectAttr.metadata = [];
        if (!this.validateMetadata(metadata)) return;

        selectAttr.metadata = selectAttr.metadata.map((item) => {
            if (item.id === metadata.id) return metadata;
            return item;
        });
        this.setState({
            showMetadata: !showMetadata,
            selectAttr,
        });
    }

    validateMetadata(metadata) {
        const { selectAttr } = this.state;
        if (!Object.prototype.hasOwnProperty.call(selectAttr, 'metadata')) selectAttr.metadata = [];
        const resp = util.isNameValid(metadata.label);
        if (!resp.result) {
            toaster.error(resp.error);
            return false;
        }

        const existName = selectAttr.metadata.some(
            item => item.label === metadata.label && item.id !== metadata.id,
        );
        if (existName) {
            toaster.warning(`The label '${metadata.label}' is already created.`);
            return false;
        }

        if (metadata.type.trim().length === 0) {
            toaster.error('The Attribute Type is required.');
            return false;
        }

        if (metadata.type.match(/^[_A-z0-9 ]*([_A-z0-9 ])*$/g) == null) {
            toaster.error('Please use only letters (a-z), numbers (0-9) and underscores (_) in Attribute Type');
            return false;
        }

        const ret = util.isTypeValid(metadata.static_value, metadata.value_type, metadata.type);
        if (!ret.result) {
            toaster.error(ret.error);
            return false;
        }

        return true;
    }

    selectMetadata(metadata) {
        this.setState({
            metadata,
        }, () => this.toogleSidebarMetadata(metadata));
    }

    handleChangeMetadata(e) {
        const { metadata } = this.state;
        const { value, name } = e.target;
        metadata[name] = value;
        this.setState({ metadata });
    }

    deleteTemplate() {
        const { template } = this.state;
        const { temp_opex, toogleSidebar } = this.props;
        TemplateActions.triggerRemoval(template.id, () => {
            toaster.success('Template removed');
            this.toogleSidebarDelete();
            toogleSidebar();
            temp_opex._fetch();
        });
    }

    toogleSidebarDelete(sidebar) {
        this.setState(prevState => (
            { [sidebar]: !prevState[sidebar] }
        ));
    }

    removeSelectAttr() {
        const { template, selectAttr } = this.state;
        template[selectAttr.attrType] = template[selectAttr.attrType].filter(
            item => item.id !== selectAttr.id,
        );
        this.toogleSidebarDelete('showDeleteAttr');
        this.toogleSidebarAttribute();
        this.setState({
            template,
        });
    }

    removeSelectMeta() {
        const { selectAttr, metadata } = this.state;
        selectAttr.metadata = selectAttr.metadata.filter(item => item.id !== metadata.id);
        this.toogleSidebarDelete('showDeleteMeta');
        this.toogleSidebarMetadata();
        this.setState({
            selectAttr,
        });
    }

    removeIds(arr) {
        return arr.map((item) => {
            const newItem = { ...item };
            delete newItem.id;
            if (Object.prototype.hasOwnProperty.call(newItem, 'metadata')) {
                newItem.metadata = this.removeIds(newItem.metadata);
            }
            return newItem;
        });
    }

    render() {
        const { showSidebar, toogleSidebar, isNewTemplate } = this.props;
        const {
            showAttribute,
            showMetadata,
            template,
            metadata,
            selectAttr,
            newAttr,
            showDeleteTemplate,
            showDeleteAttr,
            showDeleteMeta,
            isNewMetadata,
        } = this.state;

        return (
            <Fragment>
                <SidebarTemplate
                    template={template}
                    isNewTemplate={isNewTemplate}
                    showSidebar={showSidebar}
                    toogleSidebar={toogleSidebar}
                    showDeleteTemplate={showDeleteTemplate}
                    toogleSidebarAttribute={this.toogleSidebarAttribute}
                    changeValue={this.changeValue}
                    saveTemplate={this.saveTemplate}
                    updateTemplate={this.updateTemplate}
                    toogleSidebarDelete={this.toogleSidebarDelete}
                    deleteTemplate={this.deleteTemplate}
                />
                <SidebarAttribute
                    showAttribute={showAttribute}
                    template={template}
                    selectAttr={selectAttr}
                    newAttr={newAttr}
                    showDeleteAttr={showDeleteAttr}
                    toogleSidebarAttribute={this.toogleSidebarAttribute}
                    toogleSidebarMetadata={this.toogleSidebarMetadata}
                    changeAttrValue={this.changeAttrValue}
                    updateTemplateAttr={this.updateTemplateAttr}
                    addTemplateAttr={this.addTemplateAttr}
                    toogleSidebarDelete={this.toogleSidebarDelete}
                    removeSelectAttr={this.removeSelectAttr}
                    selectMetadata={this.selectMetadata}
                />
                <SidebarMetadata
                    showMetadata={showMetadata}
                    metadata={metadata}
                    showDeleteMeta={showDeleteMeta}
                    isNewMetadata={isNewMetadata}
                    toogleSidebarMetadata={this.toogleSidebarMetadata}
                    addMetadata={this.addMetadata}
                    updateMetadata={this.updateMetadata}
                    handleChangeMetadata={this.handleChangeMetadata}
                    toogleSidebarDelete={this.toogleSidebarDelete}
                    removeSelectMeta={this.removeSelectMeta}
                />
            </Fragment>
        );
    }
}

Sidebar.defaultProps = {
    showSidebar: false,
    isNewTemplate: false,
};

Sidebar.propTypes = {
    template: PropTypes.shape(templateType).isRequired,
    toogleSidebar: PropTypes.func.isRequired,
    temp_opex: PropTypes.shape(tempOpxType).isRequired,
    showSidebar: PropTypes.bool,
    isNewTemplate: PropTypes.bool,
};

export default Sidebar;
