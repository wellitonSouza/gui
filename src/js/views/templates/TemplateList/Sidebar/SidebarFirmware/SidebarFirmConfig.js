import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';
import { DojotBtnClassic } from 'Components/DojotButton';
import ImageActions from 'Actions/ImageActions';
import MaterialInput from 'Components/MaterialInput';
import { InputCheckbox } from 'Components/DojotIn';
import { templateType } from '../../../TemplatePropTypes';
import SidebarFirmImages from './SidebarFirmImages';
import SidebarButton from '../SidebarButton';

class SidebarFirmConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enabled: false,
            new_image: false,
            showFirmwareImage: false,
        };
        this.attrs = {};
        this.images = {};

        this.changeFirmwareState = this.changeFirmwareState.bind(this);
        this.defaultAttributes = this.defaultAttributes.bind(this);
        this.saveImages = this.saveImages.bind(this);
        this.toogleSidebarFirmImage = this.toogleSidebarFirmImage.bind(this);
    }

    componentDidMount() {
        // if alread enabled
        if (!this.props.isNewTemplate) {
            ImageActions.fetchImages.defer(this.props.template.id);
        }
        // if not
    }

    toogleSidebarFirmImage() {
        console.log('toogleSidebarFirmImage');
        const { showFirmwareImage } = this.state;
        this.setState({
            showFirmwareImage: !showFirmwareImage,
        });
    }

    defaultAttributes() {
        this.attrs.current_state = { label: 'Current State', user_value: 'image_state' }; // just a default value to the user
        this.attrs.update_result = { label: 'Update Result', user_value: 'update_result' }; // just a default value to the user
        this.attrs.upload_image = { label: 'Upload Image', user_value: 'trigger_update' }; // just a default value to the user 
        this.attrs.apply_image = { label: 'Apply Image', user_value: 'apply_image' }; // just a default value to the user
        this.attrs.current_version = { label: 'Current Version', user_value: 'current_version' }; // just a default value to user
    }

    // addTemplateAttr(attrs) {
    //     if (!this.validateAttrs(attrs)) return;

    //     const { template } = this.state;
    //     const [type, values] = [attrs.attrType, { ...attrs }];

    //     if (type === 'config_attrs') {
    //         values.value_type = 'string';
    //         values.type = 'meta';
    //     }
    //     if (values.type === 'dynamic') values.static_value = '';

    //     delete values.attrType;
    //     template[type].push(values);

    //     this.setState({
    //         showAttribute: false,
    //         template,
    //     });
    // }

    // TemplateActions.triggerUpdate(template, () => {
    //     toaster.success('Template updated');
    //     toogleSidebar();
    //     temp_opex._fetch();
    // });


    changeFirmwareState(e) {
        console.log('changeFirmwareState');
        if (this.state.firmware_enabled) {
            // / remove attributes on template or save removing that data
            this.setState({ firmware_enabled: false });
        } else {
            defaultAttributes();
            this.setState({ firmware_enabled: true });
        }
    }

    saveImages(e) {
        e.preventDefault();

        Object.entries(this.attrs).map(([key, attr]) => {
            console.log('Saving attr: ', attr);
            // for each attribute
            // 1  create user attrubte
            // 2. create meta attribute related to dojot configurations
            // 3. set on template
            // 4. send te triggerUpdate
            template[type].push(values);
        });
    }


    changeAttrValue(event, attr) {
        event.preventDefault();
        const name = event.target.name;
        const value = event.target.value;
        ImageActions.updateImageData(attr.id, name, value);
    }

    render() {
        this.defaultAttributes();

        console.log('SidebarFirmConfig. render', this.props);
        const { images, showFirmware, template, isNewTemplate, toogleSidebarFirmware} = this.props;
        const { firmware_enabled, showFirmwareImage } = this.state;
        const ira = this.attrs;//image-related-attribute
        return (
            <Fragment>
                <Slide right when={showFirmware} duration={300}>
                    { showFirmware
                        ? (
                            <div className="-sidebar sidebar-attribute sidebar-firmware">
                                <div className="header">
                                    <div className="title">Firmware</div>
                                    <div className="icon">
                                        <img src="images/firmware-red.png" alt="device-icon" />
                                    </div>
                                    <div className="header-path">
                                        {'template > firmware management'}
                                    </div>
                                </div>

                                <div className="body box-firmware-enabled">
                                    <div className="firmware-enabled">
                                        <div className="icon">
                                            <img src="images/firmware-red.png" alt="device-icon" />
                                        </div>
                                        <div className="description">
                                            <b>Firmware enabled</b>
                                            <br />
                                            This option allows add images in template.
                                        </div>
                                        <div className="symbol">
                                            <InputCheckbox label=""
                                                placeHolder=""
                                                name={"Firmware Enabled"}
                                                checked={firmware_enabled}
                                                handleChangeCheckbox={this.changeFirmwareState}
                                                />
                                        </div>
                                    </div>
                                    <div className="line-2" />
                                    <div className="body-form image-related-attrs">
                                        <span>To confirm the firmware configuration, please update the following attributes:</span>

                                        <div className="body-attribute-name">
                                            <MaterialInput
                                                name="current_state"
                                                className="attribute-type"
                                                maxLength={40}
                                                value={ira.current_state.user_value}
                                                onChange={e => changeAttrValue(e, ira)}
                                            >
                                                Current State
                                            </MaterialInput>
                                        </div>
                                        <div className="body-attribute-name">
                                            <MaterialInput
                                                name="update_result"
                                                className="attribute-type"
                                                maxLength={40}
                                                value={ira.update_result.user_value}
                                                onChange={e => changeAttrValue(e, ira)}
                                            >
                                                Update Result
                                            </MaterialInput>
                                        </div>
                                        <div className="body-attribute-name">
                                            <MaterialInput
                                                name="upload_image"
                                                className="attribute-type"
                                                maxLength={40}
                                                value={ira.upload_image.user_value}
                                                onChange={e => changeAttrValue(e, ira)}
                                            >
                                                Upload Image
                                            </MaterialInput>
                                        </div>
                                        <div className="body-attribute-name">
                                            <MaterialInput
                                                name="apply_image"
                                                className="attribute-type"
                                                maxLength={40}
                                                value={ira.apply_image.user_value}
                                                onChange={e => changeAttrValue(e, ira)}
                                            >
                                                Apply Image
                                            </MaterialInput>
                                        </div>
                                        <div className="body-attribute-name">
                                            <MaterialInput
                                                name="current_version"
                                                className="attribute-type"
                                                maxLength={40}
                                                value={ira.current_version.user_value}
                                                onChange={e => changeAttrValue(e, ira)}
                                            >
                                                Current Version
                                            </MaterialInput>
                                        </div>
                                    </div>
                                    <div className="body-actions">
                                        <div className="body-actions--divider" />
                                        <SidebarButton
                                            onClick={() => this.toogleSidebarFirmImage()}
                                            icon="firmware"
                                            text="Manage Images"
                                        />
                                    </div>
                                </div>
                                <div className="footer">
                                    <Fragment>
                                        <DojotBtnClassic label="discard" type="secondary" onClick={toogleSidebarFirmware} />
                                        <DojotBtnClassic color="red" label="save" type="primary" onClick={e => this.saveImages(e)} />
                                    </Fragment>
                                </div>
                            </div>
                        )
                        : <div />
                    }
                </Slide>
                <SidebarFirmImages
                    showFirmware={showFirmwareImage}
                    isNewTemplate={isNewTemplate}
                    template={template}
                    images={images}
                    toogleSidebarFirmware={this.toogleSidebarFirmImage}
                />
            </Fragment>
        );
    }
}


SidebarFirmConfig.defaultProps = {
    showFirmware: false,
    isNewTemplate: false,
};

SidebarFirmConfig.propTypes = {
    showFirmware: PropTypes.bool,
    isNewTemplate: PropTypes.bool,
    template: PropTypes.shape(templateType).isRequired,
    toogleSidebarFirmware: PropTypes.func.isRequired,
};

export default SidebarFirmConfig;
