import React, { Component, Fragment } from 'react';
import SidebarDevice from './SidebarDevice';
import SidebarManageTemplates from './SidebarManageTemplates';
import SidebarDeviceAttrs from './SidebarDeviceAttrs';


class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSidebarDevice: true,
            showManageTemplates: false,
        };

        this.handleShowDevice = this.handleShowDevice.bind(this);
        this.handleShowManageTemplate = this.handleShowManageTemplate.bind(this);
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

    render() {
        const { showSidebarDevice, showManageTemplates } = this.state;
        return (
            <Fragment>
                <SidebarDevice
                    showSidebar={showSidebarDevice}
                    handleShowDevice={this.handleShowDevice}
                    handleShowManageTemplate={this.handleShowManageTemplate}
                />
                <SidebarManageTemplates
                    showSidebar={showManageTemplates}
                    handleShowManageTemplate={this.handleShowManageTemplate}
                />
                <SidebarDeviceAttrs/>
            </Fragment>
        );
    }
}

export default Sidebar;
