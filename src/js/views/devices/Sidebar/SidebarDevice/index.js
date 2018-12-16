import React from 'react';
import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';
import { DojotCustomButton } from 'Components/DojotButton';
import SidebarButton from 'Components/SidebarButton';
import MaterialInput from 'Components/MaterialInput';
import { FormActions } from '../../Actions';

const SidebarDevice = ({
    showSidebarDevice,
    handleShowManageTemplate,
    handleShowDeviceAttrs,
    device,
    handleChangeName,
    selectedTemplates,
    save,
}) => {
    const {
        configValues, dynamicValues, staticValues, actuatorValues,
    } = device;
    return (
        <Slide right when={showSidebarDevice} duration={300}>
            {
                showSidebarDevice
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
                                            value={device.label}
                                            onChange={e => handleChangeName(e.target.value)}
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
                                            <div className="template-bagde">
                                                <div
                                                    className="total-attrs"
                                                >
                                                    {selectedTemplates.length}
                                                </div>
                                                <div
                                                    className="template-name"
                                                >
                                                    {'Templates Selecionados'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="device-attrs">
                                    <div className="label">3. Manage Attributes</div>
                                    <SidebarButton
                                        onClick={() => handleShowDeviceAttrs(configValues)}
                                        icon="config_attrs"
                                        title="Configuration"
                                        disable={configValues.length === 0}
                                    />
                                    <SidebarButton
                                        onClick={() => handleShowDeviceAttrs(staticValues)}
                                        icon="data_attrs"
                                        title="Static Values"
                                        disable={staticValues.length === 0}
                                    />
                                    <SidebarButton
                                        onClick={() => handleShowDeviceAttrs(dynamicValues)}
                                        icon="data_attrs"
                                        title="Dynamic Attributes"
                                        disable={dynamicValues.length === 0}
                                    />
                                    <SidebarButton
                                        onClick={() => handleShowDeviceAttrs(actuatorValues)}
                                        icon="config_attrs"
                                        title="Actuators"
                                        disable={actuatorValues.length === 0}
                                    />
                                </div>

                            </div>

                            <div className="footer">
                                <DojotCustomButton
                                    label="discard"
                                    onClick={() => FormActions.toggleSidebarDevice(false)}
                                />
                                <DojotCustomButton
                                    label="save"
                                    type="primary"
                                    onClick={save}
                                />
                            </div>
                        </div>
                    )
                    : <div />
            }
        </Slide>
    );
};

SidebarDevice.defaultProps = {
    showSidebarDevice: true,
    device: {
        label: '',
        id: '',
        protocol: 'MQTT',
        templates: [],
        tags: [],
        attrs: [],
        configValues: [],
        dynamicValues: [],
        staticValues: [],
        actuatorValues: [],
        metadata: {},
    },
};

SidebarDevice.propTypes = {
    showSidebarDevice: PropTypes.bool,
    handleShowManageTemplate: PropTypes.func.isRequired,
    handleShowDeviceAttrs: PropTypes.func.isRequired,
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
export default SidebarDevice;
