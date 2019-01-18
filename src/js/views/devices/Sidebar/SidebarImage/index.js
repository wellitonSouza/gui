import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';
import { DojotBtnClassic } from 'Components/DojotButton';
import ImageActions from 'Actions/ImageActions';
import MaterialInput from 'Components/MaterialInput';
import MaterialSelect from 'Components/MaterialSelect';
import SidebarFirmImages from '../../../templates/TemplateList/Sidebar/SidebarFirmware/SidebarFirmImages';
import SidebarButton from '../../../templates/TemplateList/Sidebar/SidebarButton';

class SidebarImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFirmwareImage: false,
            attrs: { current_state: '', update_result: '', current_version: '' },
        };

        this.valid_template = { id: 1231 };
        this.images = {};
        this.currentImageId = 1;
        this.attrs = {};
        this.attrs.current_state = { label: 'Current State', user_value: 'image_state' }; // just a default value to the user
        this.attrs.update_result = { label: 'Update Result', user_value: 'update_result' }; // just a default value to the user
        this.attrs.upload_image = { label: 'Upload Image', user_value: 'trigger_update' }; // just a default value to the user
        this.attrs.apply_image = { label: 'Apply Image', user_value: 'apply_image' }; // just a default value to the user
        this.attrs.current_version = { label: 'Current Version', user_value: 'current_version' }; // just a default value to user

        this.callUploadImage = this.callUploadImage.bind(this);
        this.callApplyImage = this.callApplyImage.bind(this);
        this.toogleSidebarFirmImage = this.toogleSidebarFirmImage.bind(this);
        this.createImageOptions = this.createImageOptions.bind(this);
        this.onChange = this.onChange.bind(this);
    }


    componentDidMount() {
        console.log('infos about devices', this.props.devices);
        // // Request information about devices attr related to images
        // ImageActions.fetchImages.defer(this.props.template.id);

        // current version is dynamic value
        // it should get in backstage or history
        // current state is static value
        // update result is a static value
        const attrs = { current_state: 'Idle', update_result: 'No image', current_version: '0.1 Alpha' };
        this.setState({
            attrs,
        });

        // request information about images on tempalte
    }

    onChange() {
        console.log('onChange');
    }


    callUploadImage() {
        console.log('callUploadImage');
    }

    callApplyImage() {
        console.log('callApplyImage');
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
            items.push(<option key={images_info[i].id} value={images_info[i].id}>
                {images_info[i].fw_version} </option>);
        }
        return items;
    }


    render() {
        console.log('SidebarImage. render', this.props);
        const { toogleSidebarImages, showSidebarImage } = this.props;
        const { attrs, current_image, showFirmwareImage } = this.state;
        const template = {};
        const ira = this.attrs;// image-related-attribute
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
                                        <img src="images/firmware-red.png" alt="device-icon" />
                                    </div>
                                    <div className="header-path">
                                        {'device > image management'}
                                    </div>
                                </div>

                                <div className="body box-image-info">
                                    <div className="info firmware-enabled">
                                        <div className="icon">
                                            <img src="images/firmware-red.png" alt="device-icon" />
                                        </div>
                                        <div className="description">
                                            <div className="line">
                                                <div className="label">Current Version</div>
                                                <div className="value"> attrs.current_version}</div>
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
                                    <div className="body-form">
                                    <label className="header2">Image to be uploaded</label>
                                        <div className="col s8">
                                            <MaterialSelect id="flr_images" name="images" label="Images to be sent" value={this.currentImageId} onChange={this.onChange}>
                                                {opts}
                                            </MaterialSelect>
                                        </div>
                                        <div className="col s4">
                                            <div className="square-button" onClick={this.callUploadImage} >
                                        <i className="fa fa-upload fa-2x"  />
                                            Upload</div>
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
                                        <DojotBtnClassic color="red" label="save" type="primary" onClick={e => this.callApplyImage(e)} />
                                    </Fragment>
                                </div>
                            </div>
                        )
                        : <div />
                    }
                </Slide>
                <SidebarFirmImages
                    showFirmware={showFirmwareImage}
                    template={template}
                    images={this.images}
                    toogleSidebarImages={this.toogleSidebarFirmImage}
                />
            </Fragment>
        );
    }
}


SidebarImage.defaultProps = {
    showSidebarImage: false,
};

SidebarImage.propTypes = {
    showSidebarImage: PropTypes.bool,
    toogleSidebarImages: PropTypes.func.isRequired,
};
// selectedTemplates: React.PropTypes.arrayOf(PropTypes.string).isRequired,

export default SidebarImage;
