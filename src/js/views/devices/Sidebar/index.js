import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
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
            selectedTemplates: [],
            device: {},
            selectAttr: [],
        };

        this.handleShowManageTemplate = this.handleShowManageTemplate.bind(this);
        this.handleShowDeviceAttrs = this.handleShowDeviceAttrs.bind(this);
        this.handleSelectTemplate = this.handleSelectTemplate.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
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
            selectedTemplates: device.templates,
            device,
        });
    }

    handleShowManageTemplate() {
        this.setState(prevState => ({
            showManageTemplates: !prevState.showManageTemplates,
        }));
    }

    handleSelectTemplate(checked, template) {
        const { selectedTemplates, device } = this.state;
        let list;
        if (checked) {
            list = selectedTemplates.filter(id => id !== template.id);
            delete device.attrs[template.id];
        } else {
            list = [...selectedTemplates, template.id];
            device.attrs[template.id] = [...template.attrs];
        }
        device.templates = list;
        this.setState(prevState => ({
            ...prevState,
            selectedTemplates: list,
            device,
        }));
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

    render() {
        const {
            showSidebarDevice,
            showManageTemplates,
            showDeviceAttrs,
            selectedTemplates,
            device,
            selectAttr,
        } = this.state;
        const { toggleSidebarDevice } = this.props;
        console.log('Sidebar', device);
        return (
            <Fragment>
                <SidebarDevice
                    showSidebarDevice={showSidebarDevice}
                    handleShowDevice={toggleSidebarDevice}
                    selectedTemplates={selectedTemplates}
                    device={device}
                    handleChangeName={this.handleChangeName}
                    handleShowManageTemplate={this.handleShowManageTemplate}
                    handleShowDeviceAttrs={this.handleShowDeviceAttrs}
                />
                <AltContainer store={TemplateStore}>
                    <SidebarManageTemplates
                        showManageTemplates={showManageTemplates}
                        selectedTemplates={selectedTemplates}
                        handleShowManageTemplate={this.handleShowManageTemplate}
                        handleSelectTemplate={this.handleSelectTemplate}
                    />
                </AltContainer>
                <SidebarDeviceAttrs
                    showDeviceAttrs={showDeviceAttrs}
                    selectAttr={selectAttr}
                    handleShowDeviceAttrs={this.handleShowDeviceAttrs}
                />
            </Fragment>
        );
    }
}

Sidebar.defaultProps = {
    device: {
        label: '',
        id: '',
        protocol: 'MQTT',
        templates: [],
        tags: [],
        attrs: {},
    },
};

Sidebar.propTypes = {
    showSidebarDevice: PropTypes.bool.isRequired,
    toggleSidebarDevice: PropTypes.func.isRequired,
    device: PropTypes.shape({
        attrs: PropTypes.object,
        created: PropTypes.string,
        id: PropTypes.string,
        label: PropTypes.string,
        static_attrs: PropTypes.array,
        status: PropTypes.string,
        tags: PropTypes.array,
        templates: PropTypes.array,
        updated: PropTypes.string,
    }),
};

export default Sidebar;
