import React, { Component, Fragment } from 'react';
import TemplateStore from 'Stores/TemplateStore';
import AltContainer from 'alt-container';
import SidebarDevice from './SidebarDevice';
import SidebarManageTemplates from './SidebarManageTemplates';
import SidebarDeviceAttrs from './SidebarDeviceAttrs';

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
        this.saveAttr = this.saveAttr.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.showSidebarDevice !== state.showSidebarDevice) {
            return {
                ...state,
                showSidebarDevice: props.showSidebarDevice,
            };
        }
        return null;
    }

    componentDidMount() {
        const { showSidebarDevice, device } = this.props;
        this.setState({
            showSidebarDevice,
            usedTemplates: device.templates,
            device,
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
            device.attrs = device.attrs.filter(attr => +attr.template_id !== template.id);
        } else {
            device.templates.push(template.id);
            device.attrs = device.attrs.concat(template.attrs);
        }
        device.configValues = device.attrs.filter(item => item.type === 'meta');
        device.dynamicValues = device.attrs.filter(item => item.type === 'dynamic');
        device.staticValues = device.attrs.filter(item => item.type === 'static');
        device.actuatorValues = device.attrs.filter(item => item.type === 'actuator');
        device.metadata = {};
        device.attrs.forEach((item) => {
            if (Object.prototype.hasOwnProperty.call(item, 'metadata')) {
                device.metadata[item.id] = [...item.metadata];
            }
        });

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

    saveAttr() {
        const { device } = this.state;
        console.log(device)
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
