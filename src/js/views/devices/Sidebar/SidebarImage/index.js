import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';
import { DojotBtnClassic } from 'Components/DojotButton';
import ImageActions from 'Actions/ImageActions';
import MaterialSelect from 'Components/MaterialSelect';
import SidebarFirmImages from 'Views/templates/TemplateList/Sidebar/SidebarFirmware/SidebarFirmImages';
import SidebarButton from 'Views/templates/TemplateList/Sidebar/SidebarButton';
import DeviceActions from 'Actions/DeviceActions';
import toaster from 'Comms/util/materialize';

class SidebarImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            showFirmwareImage: false,
            attrs: { current_state: '', update_result: '', current_version: '' },
            currentImageId: '1',
        };
        // this.attrs = {};
        // this.attrs.current_state = { label: 'Current State', user_value: 'image_state' }; // just a default value to the user
        // this.attrs.update_result = { label: 'Update Result', user_value: 'update_result' }; // just a default value to the user
        // this.attrs.upload_image = { label: 'Upload Image', user_value: 'trigger_update' }; // just a default value to the user
        // this.attrs.apply_image = { label: 'Apply Image', user_value: 'apply_image' }; // just a default value to the user
        // this.attrs.current_version = { label: 'Current Version', user_value: 'current_version' }; // just a default value to user

        this.callUploadImage = this.callUploadImage.bind(this);
        this.callApplyImage = this.callApplyImage.bind(this);
        this.toogleSidebarFirmImage = this.toogleSidebarFirmImage.bind(this);
        this.createImageOptions = this.createImageOptions.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.templateIdAllowedImage !== state.templateIdAllowedImage) {
            return {
                ...state,
                templateIdAllowedImage: props.templateIdAllowedImage,
                loaded: false,
            };
        }
        // Oh my God... look that man
        if (props.devices[props.device.id].current_state !== state.attrs.current_state) {
            return {
                ...state,
                attrs: { current_state: props.devices[props.device.id].current_state },
            };
        }
        return null;
    }


    componentDidUpdate() {
        console.log('componentDidUpdate: requested', this.state.loaded);


        if (!this.state.loaded && this.state.templateIdAllowedImage !== '') {
            console.log('request info for template: ', this.props.templateIdAllowedImage);

            const templateId = this.props.templateIdAllowedImage;
            ImageActions.fetchImages(templateId);
            DeviceActions.fetchSingle(this.props.deviceId, () => {
                toaster.success('Device requested');

                // We should ask data for 3 measures...
                MeasureActions.fetchMeasure.defer(this.props.device, 'current_state', 1);
                MeasureActions.fetchMeasure.defer(this.props.device, 'update_result', 1);
                MeasureActions.fetchMeasure.defer(this.props.device, 'current_version', 1);
            });
            current_state;
            update_result;
            current_version;
            // current version is dynamic value
            // it should get in backstage or history
            // current state is static value
            // update result is a static value
            // request information about images on tempalte
            const attrs = { current_state: '', update_result: '', current_version: '' };
            this.setState({
                attrs,
                loaded: true,
            });
        }
    }

    onChangeImage(e, value) {
        console.log('onChangeImage', this.state.currentImageId, value);
        // const target = event.target;
        // const user = this.state.user;
        // user[target.name] = target.value;
        // this.fieldValidation(user, target.name);
    }


    callUploadImage() {
        console.log('callUploadImage');

        // find the actuator responsable for upload image
        const upload_image_alias = 'upload_image';
        // sets the new value;
        const { currentImageId } = this.state;
        const { device } = this.props;
        console.log('currentImageId', currentImageId);
        console.log('device ', device);
        device.attrs[upload_image_alias] = currentImageId;
        DeviceActions.triggerUpdate(device, () => {
            toaster.success('Image successfully transferred');
        });
    }

    callApplyImage() {
        console.log('callApplyImage');
        const { device } = this.props;
        device.attrs[apply_image] = 1;

        DeviceActions.triggerUpdate(device, () => {
            toaster.success('Image Applied');
            // hashHistory.push('/device/list');
        });
    }

    toogleSidebarFirmImage() {
        console.log('toogleSidebarFirmImage');
        const { showFirmwareImage } = this.state;
        this.setState({
            showFirmwareImage: !showFirmwareImage,
        });
    }

    createImageOptions() {
        const items = [];
        items.push(<option key="selectedImage" value="">Select an image</option>);

        const images_info = [{ id: 1, fw_version: '0.1 alpha' }, { id: 2, fw_version: '0.2 beta' }];
        for (let i = 0; i < images_info.length; i++) {
            items.push(<option key={images_info[i].id} value={images_info[i].id}>{images_info[i].fw_version}</option>);
        }
        return items;
    }


    render() {
        console.log('SidebarImage. render', this.props);
        const { toogleSidebarImages, showSidebarImage } = this.props;
        const { attrs, showFirmwareImage, templateIdAllowedImage } = this.state;
        const opts = this.createImageOptions();

        return (
            <Fragment>
                <Slide right when={showSidebarImage} duration={300}>
                    { showSidebarImage
                        ? (
                            <div className="-sidebar sidebar-attribute sidebar-firmware">
                                <div className="header">
                                    <div className="title">Firmware</div>
                                    <div className="icon">
                                        <img src="images/firmware-red.png" alt="firmware-icon" />
                                    </div>
                                    <div className="header-path">
                                        {'device > image management'}
                                    </div>
                                </div>

                                <div className="body box-image-info">
                                    <div className="info firmware-enabled">
                                        <div className="icon">
                                            <img src="images/icons/firmware-gray.png" alt="device-icon" />
                                        </div>
                                        <div className="desc">
                                            <div className="line">
                                                <div className="label">Current Version</div>
                                                <div className="value">{attrs.current_version}</div>
                                            </div>
                                            <div className="line">
                                                <div className="label">Current State</div>
                                                <div className="value">{attrs.current_state}</div>
                                            </div>
                                            <div className="line">
                                                <div className="label">Update Result</div>
                                                <div className="value">{attrs.update_result}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="line-2" />
                                    <div className="body-form pl50">
                                        <div className="header2">Image to be transfer</div>
                                        <div className="cid_select">
                                            <MaterialSelect id="flr_images" name="images" label="Available images" value={this.currentImageId} onChange={e => onChangeImage(e, currentImageId)}>
                                                {opts}
                                            </MaterialSelect>
                                        </div>
                                        <div className="cid_upload_button">
                                            <div className="square-button" onClick={this.callUploadImage}>
                                                <i className="fa fa-download fa-2x" />
                                                Transfer
                                            </div>
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
                                        <DojotBtnClassic label="discard" type="secondary" onClick={toogleSidebarImages} />
                                        <DojotBtnClassic color="red" label="Apply" type="primary" onClick={e => this.callApplyImage(e)} />
                                    </Fragment>
                                </div>
                            </div>
                        )
                        : <div />
                    }
                </Slide>
                <SidebarFirmImages
                    showFirmware={showFirmwareImage}
                    templateId={templateIdAllowedImage}
                    images={this.props.images}
                    toogleSidebarFirmware={this.toogleSidebarFirmImage}
                />
            </Fragment>
        );
    }
}


SidebarImage.defaultProps = {
    showSidebarImage: false,
    templateIdAllowedImage: '',
    hasTemplateWithImages: false,
};

SidebarImage.propTypes = {
    hasTemplateWithImages: PropTypes.bool,
    templateIdAllowedImage: PropTypes.string,
    showSidebarImage: PropTypes.bool,
    toogleSidebarImages: PropTypes.func.isRequired,
};

export default SidebarImage;
