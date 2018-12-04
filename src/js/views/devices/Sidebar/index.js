import React, { Component, Fragment } from 'react';
import SidebarDevice from './SidebarDevice';
import SidebarManageTemplates from './SidebarManageTemplates';
import SidebarDeviceAttrs from './SidebarDeviceAttrs';
import TemplateStore from 'Stores/TemplateStore';
import AltContainer from 'alt-container';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSidebarDevice: true,
            showManageTemplates: false,
            showDeviceAttrs: false,
        };

        this.handleShowDevice = this.handleShowDevice.bind(this);
        this.handleShowManageTemplate = this.handleShowManageTemplate.bind(this);
        this.handleShowDeviceAttrs = this.handleShowDeviceAttrs.bind(this);
    }

    handleShowDevice() {
        console.log('clicou');
        this.setState(prevState => ({
            showSidebarDevice: !prevState.showSidebarDevice,
        }));
    }

    handleShowManageTemplate() {
        console.log('clicou');
        this.setState(prevState => ({
            showManageTemplates: !prevState.showManageTemplates,
        }));
    }

    handleShowDeviceAttrs() {
        this.setState(prevState => ({
            showDeviceAttrs: !prevState.showDeviceAttrs,
        }));
    }

    render() {
        const { showSidebarDevice, showManageTemplates, showDeviceAttrs } = this.state;
        console.log('render sidebar', showManageTemplates);
        return (
            <Fragment>
                <SidebarDevice
                    showSidebar={showSidebarDevice}
                    handleShowDevice={this.handleShowDevice}
                    handleShowManageTemplate={this.handleShowManageTemplate}
                    handleShowDeviceAttrs={this.handleShowDeviceAttrs}
                />
                <AltContainer store={TemplateStore}>
                    <SidebarManageTemplates
                        showSidebar={showManageTemplates}
                        handleShowManageTemplate={this.handleShowManageTemplate}
                    />
                </AltContainer>
                <SidebarDeviceAttrs
                    showSidebar={showDeviceAttrs}
                    handleShowDeviceAttrs={this.handleShowDeviceAttrs}
                />
            </Fragment>
        );
    }
}

export default Sidebar;
