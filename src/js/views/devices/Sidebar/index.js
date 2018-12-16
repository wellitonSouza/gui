import React, { Component, Fragment } from 'react';
import TemplateStore from 'Stores/TemplateStore';
import AltContainer from 'alt-container';
import SidebarDevice from './SidebarDevice';
import SidebarManageTemplates from './SidebarManageTemplates';
import SidebarDeviceAttrs from './SidebarDeviceAttrs';
import toaster from "Comms/util/materialize";
import {FormActions} from "../Actions";

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSidebarDevice: false,
            showManageTemplates: false,
            showDeviceAttrs: false,
            usedTemplates: [],
            device: {},
            selectAttr: [],
        };

        this.handleShowManageTemplate = this.handleShowManageTemplate.bind(this);
        this.handleShowDeviceAttrs = this.handleShowDeviceAttrs.bind(this);
        this.handleSelectTemplate = this.handleSelectTemplate.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeMetadata = this.handleChangeMetadata.bind(this);
        this.save = this.save.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.showSidebarDevice !== state.showSidebarDevice) {
            return {
                ...state,
                device: props.device,
                showSidebarDevice: props.showSidebarDevice,
            };
        }
        if (props.device !== state.device) {
            return {
                ...state,
                device: props.device,
            };
        }
        return null;
    }

    componentDidMount() {
        const { showSidebarDevice, device } = this.props;
        console.log('componentDidMount', device)
        this.setState({
            showSidebarDevice,
            device,
            usedTemplates: device.templates,
        });
    }

    handleShowManageTemplate() {
        this.setState(prevState => ({
            showManageTemplates: !prevState.showManageTemplates,
        }));
    }

    handleSelectTemplate(checked, template) {
        const { device } = this.state;
        if (checked) {
            device.templates = device.templates.filter(id => id !== template.id);
            delete device.attrs[template.id];
        } else {
            device.templates.push(template.id);
            device.attrs[template.id] = template.attrs;
        }

        device.configValues = [];
        device.dynamicValues = [];
        device.staticValues = [];
        device.actuatorValues = [];
        device.metadata = {};

        device.templates.forEach((id) => {
            device.configValues = device.configValues.concat(device.attrs[id].filter(item => item.type === 'meta'));
            device.dynamicValues = device.dynamicValues.concat(device.attrs[id].filter(item => item.type === 'dynamic'));
            device.staticValues = device.staticValues.concat(device.attrs[id].filter(item => item.type === 'static'));
            device.actuatorValues = device.actuatorValues.concat(device.attrs[id].filter(item => item.type === 'actuator'));
            device.attrs[id].forEach((item) => {
                if (Object.prototype.hasOwnProperty.call(item, 'metadata')) {
                    device.metadata[item.id] = [...item.metadata];
                }
            });
        })

        this.setState({
            device,
            usedTemplates: device.templates,
        });
    }

    handleChangeName(value) {
        const { device } = this.state;
        device.label = value;
        this.setState(prevState => ({
            ...prevState,
            device,
        }));
    }

    handleShowDeviceAttrs(selectAttr) {
        this.setState(prevState => ({
            showDeviceAttrs: !prevState.showDeviceAttrs,
            selectAttr,
        }));
    }

    handleChangeMetadata(event, id) {
        const { device } = this.state;
        device.metadata[id] = device.metadata[id].map(meta => (meta.label === event.target.name
            ? { ...meta, static_value: event.target.value }
            : meta
        ));

        this.setState({
            device,
        });
    }

    save() {
        const { device } = this.state;
        const saveDevice = { ...device };

        saveDevice.templates.forEach((id) => {
            saveDevice.attrs[id] = saveDevice.attrs[id].map((attr) => {
                if (saveDevice.metadata[attr.id]) {
                    return {
                        ...attr,
                        metadata: saveDevice.metadata[attr.id],
                    };
                }
                return attr;
            });
        })

        delete saveDevice.configValues;
        delete saveDevice.dynamicValues;
        delete saveDevice.staticValues;
        delete saveDevice.actuatorValues;
        delete saveDevice.metadata;
        FormActions.triggerUpdate(saveDevice, () => {
            toaster.success('Device updated');
            // hashHistory.push('/device/list');
        });
    }


    render() {
        const {
            showSidebarDevice,
            showManageTemplates,
            showDeviceAttrs,
            usedTemplates,
            device,
            selectAttr,
        } = this.state;
        if (!Object.prototype.hasOwnProperty.call(device, 'attrs')) return <div />;
        const { metadata } = device;
        return (
            <Fragment>
                <SidebarDevice
                    showSidebarDevice={showSidebarDevice}
                    selectedTemplates={usedTemplates}
                    device={device}
                    handleChangeName={this.handleChangeName}
                    handleShowManageTemplate={this.handleShowManageTemplate}
                    handleShowDeviceAttrs={this.handleShowDeviceAttrs}
                    save={this.save}
                />
                <AltContainer store={TemplateStore}>
                    <SidebarManageTemplates
                        showManageTemplates={showManageTemplates}
                        selectedTemplates={usedTemplates}
                        handleShowManageTemplate={this.handleShowManageTemplate}
                        handleSelectTemplate={this.handleSelectTemplate}
                    />
                </AltContainer>
                <SidebarDeviceAttrs
                    showDeviceAttrs={showDeviceAttrs}
                    selectAttr={selectAttr}
                    metadata={metadata}
                    handleShowDeviceAttrs={this.handleShowDeviceAttrs}
                    handleChangeMetadata={this.handleChangeMetadata}
                />
            </Fragment>
        );
    }
}

export default Sidebar;
