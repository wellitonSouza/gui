import React from 'react';
import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';
import { DojotCustomButton } from 'Components/DojotButton';
import SidebarButton from 'Components/SidebarButton';
import MaterialInput from 'Components/MaterialInput';
import TemplateBagde from '../TemplateBadge';

const SidebarDevice = ({
    showSidebar, handleShowDevice, handleShowManageTemplate, handleShowDeviceAttrs,
}) => (
    <Slide right when={showSidebar} duration={300}>
        {
            showSidebar
                ? (
                    <div className="device-sidebar">
                        <div className="header">
                            <div className="title">
                                new device
                            </div>
                            <div className="icon">
                                <img src="images/icons/chip-cyan.png" alt="device-icon" />
                            </div>
                        </div>
                        <div className="body">
                            <div className="title">
                                device
                            </div>

                            <div className="device-name">
                                <div className="label">1. Set a name</div>
                                <div className="device-name-input">
                                    <MaterialInput
                                        name="name"
                                        maxLength={40}
                                    >
                                        Name
                                    </MaterialInput>
                                </div>
                            </div>

                            <div className="device-templates">
                                <div className="label">2. Add or Remove Templates</div>
                                <div className="template-list">
                                    <div
                                        className="add-template-button"
                                        onClick={handleShowManageTemplate}
                                        onKeyPress={handleShowManageTemplate}
                                        tabIndex="0"
                                        role="button"
                                    >
                                        +
                                    </div>
                                    <div className="list">
                                        <TemplateBagde />
                                        <TemplateBagde />
                                        <TemplateBagde />
                                    </div>
                                </div>

                            </div>

                            <div className="device-attrs">
                                <div className="label">3. Manage Attributes</div>
                                <SidebarButton
                                    onClick={handleShowDeviceAttrs}
                                    icon="config_attrs"
                                    title="Configuration"
                                    subtitle="3 of 10 configured"
                                />
                                <SidebarButton
                                    onClick={handleShowDeviceAttrs}
                                    icon="data_attrs"
                                    title="Static Values"
                                    subtitle="3 of 10 configured"
                                />
                                <SidebarButton
                                    onClick={handleShowDeviceAttrs}
                                    icon="data_attrs"
                                    title="Dynamic Attributes"
                                    subtitle="3 of 10 configured"
                                />
                                <SidebarButton
                                    onClick={handleShowDeviceAttrs}
                                    icon="config_attrs"
                                    title="Actuators"
                                    subtitle="3 of 10 configured"
                                />
                            </div>

                        </div>

                        <div className="footer">
                            <DojotCustomButton label="discard" onClick={handleShowDevice} />
                            <DojotCustomButton label="save" type="primary" />
                        </div>
                    </div>
                )
                : <div />
        }
    </Slide>
);


SidebarDevice.defaultProps = {
    showSidebar: true,
};

SidebarDevice.propTypes = {
    showSidebar: PropTypes.bool,
    handleShowDevice: PropTypes.func.isRequired,
    handleShowManageTemplate: PropTypes.func.isRequired,
    handleShowDeviceAttrs: PropTypes.func.isRequired,
};
export default SidebarDevice;
