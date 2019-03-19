import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';
import { DojotBtnClassic } from 'Components/DojotButton';
import ImageActions from 'Actions/ImageActions';
import MeasureActions from 'Actions/MeasureActions';
import MaterialSelect from 'Components/MaterialSelect';
import SidebarFirmImages from 'Views/templates/TemplateList/Sidebar/SidebarFirmware/SidebarFirmImages';
import SidebarButton from 'Views/templates/TemplateList/Sidebar/SidebarButton';
import DeviceActions from 'Actions/DeviceActions';
import toaster from 'Comms/util/materialize';
import util from "Comms/util";
import { withNamespaces } from 'react-i18next';

let imageSocket = null;

class SidebarImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            showFirmwareImage: false,
            attrs: {
                dojotFirmwareUpdateState: 'No data received',
                dojotFirmwareUpdateUpdateResult: 'No data received',
                dojotFirmwareUpdateVersion: 'No data received',
},
            currentImageId: '0',
        };
        this.callUploadImage = this.callUploadImage.bind(this);
        this.callApplyImage = this.callApplyImage.bind(this);
        this.toogleSidebarFirmImage = this.toogleSidebarFirmImage.bind(this);
        this.createImageOptions = this.createImageOptions.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.getAttrLabel = this.getAttrLabel.bind(this);
        this.receivedImageInformation = this.receivedImageInformation.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.templateIdAllowedImage !== state.templateIdAllowedImage) {
            return {
                ...state,
                templateIdAllowedImage: props.templateIdAllowedImage,
                loaded: false,
            };
        }
        return null;
    }


    componentDidUpdate() {
        const { loaded, templateIdAllowedImage } = this.state;
        if (!loaded && templateIdAllowedImage !== '') {
            const { deviceId } = this.props;
            const templateId = templateIdAllowedImage;
            ImageActions.fetchImages.defer(templateId);
            DeviceActions.fetchSingle.defer(deviceId);
            this.setState({
                loaded: true,
            });
        }
    }


    receivedImageInformation(data) {
        console.log("receivedImageInformation", data);
        const { attrs: mattrs } = data;
        const { attrs } = this.state;
        attrs[dojotFirmwareUpdateState] = mattrs[this.getAttrLabel('dojot:firmware_update:state')];
        attrs[dojotFirmwareUpdateUpdateResult] = mattrs[this.getAttrLabel('dojot:firmware_update:update_result')];
        attrs[dojotFirmwareUpdateVersion] = mattrs[this.getAttrLabel('dojot:firmware_update:version')];
        this.setState({
            attrs,
        });
    }


    onChangeImage(e) {
        const newImageId = e.target.value;
        this.setState({
            currentImageId: newImageId,
        });
    }

    getAttrLabel(dojotLabel) {
        const { deviceId, ds } = this.props;
        const { templateIdAllowedImage: templateId } = this.state;
        const device = ds.devices[deviceId];
        let relatedLabel = '';
        device.attrs[templateId].forEach((attr) => {
            if (attr.metadata) {
                const el = attr.metadata.filter(meta => meta.label == dojotLabel);
                if (el.length) { relatedLabel = attr.label; } // found the attr
            }
        });
        return relatedLabel;
    }


    callUploadImage() {
        const { currentImageId } = this.state;
        if (currentImageId === '0') {
            toaster.warning('Select a valid image');
            return;
        }

        const { t, deviceId } = this.props;
        const uploadImageAlias = this.getAttrLabel('dojot:firmware_update:desired_version');
        const dataToBeSent = { attrs: {} };
        dataToBeSent.attrs[uploadImageAlias] = currentImageId;

        DeviceActions.triggerActuator(deviceId, dataToBeSent, () => {
            toaster.success(t('firmware:alerts.image_transferred'));
        });
    }

    callApplyImage() {
        const { t, deviceId } = this.props;
        const applyAlias = this.getAttrLabel('dojot:firmware_update:update');
        const dataToBeSent = { attrs: {} };
        dataToBeSent.attrs[applyAlias] = '1';
        // value used to notify device to apply its image

        DeviceActions.triggerActuator(deviceId, dataToBeSent, () => {
            toaster.success(t('firmware:alerts.image_applied'));
        });
    }

    toogleSidebarFirmImage() {
        const { showFirmwareImage } = this.state;
        this.setState({
            showFirmwareImage: !showFirmwareImage,
        });
    }

    createImageOptions() {
        const items = [];
        items.push(<option key="selectedImage" value="0">Select an image</option>);
        const { is: { images } } = this.props;
        if (Object.keys(images).length) {
            Object.values(images).forEach((el) => {
                items.push(<option key={el.id} value={el.id}>{el.fw_version}</option>);
            });
        }
        return items;
    }


    render() {
        const {
            t, toogleSidebarImages, showSidebarImage, is,
        } = this.props;
        const { images } = is;
        const { attrs, showFirmwareImage, templateIdAllowedImage } = this.state;
        const opts = this.createImageOptions();

        return (
            <Fragment>
                <FirmwareWebSocket onChange={this.receivedImageInformation} />
                <Slide right when={showSidebarImage} duration={300}>
                    { showSidebarImage
                        ? (
                            <div className="sidebar-firmware">
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
                                    <div className="sub-content">
                                        <div className="info firmware-enabled">
                                            <div className="icon">
                                                <img src="images/icons/firmware-gray.png" alt="device-icon" />
                                            </div>
                                            <div className="desc">
                                                <div className="line">
                                                    <div className="label">{t('firmware:default_attrs.current_version')}</div>
                                                    <div className="value">{attrs.dojotFirmwareUpdateVersion}</div>
                                                </div>
                                                <div className="line">
                                                    <div className="label">{t('firmware:default_attrs.state')}</div>
                                                    <div className="value">{attrs.dojotFirmwareUpdateState}</div>
                                                </div>
                                                <div className="line">
                                                    <div className="label">{t('firmware:default_attrs.update_result')}</div>
                                                    <div className="value">{attrs.dojotFirmwareUpdateUpdateResult}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="line-2" />
                                        <div className="body-form pl50">
                                            <div className="header2">{t('firmware:alerts.image_to_transfer')}</div>
                                            <div className="cid_select">
                                                <MaterialSelect id="flr_images" name="images" label={t('firmware:labels.available')} value={this.currentImageId} onChange={e => this.onChangeImage(e)}>
                                                    {opts}
                                                </MaterialSelect>
                                            </div>
                                            <div className="cid_upload_button">
                                                <div className="square-button" onKeyPress={this.callUploadImage} tabIndex="0" role="button" onClick={this.callUploadImage}>
                                                    <i className="fa fa-download fa-2x" />
                                                    {t('firmware:labels.transfer')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="body-actions">
                                        <div className="body-actions--divider" />
                                        <SidebarButton
                                            onClick={() => this.toogleSidebarFirmImage()}
                                            icon="firmware"
                                            text={t('firmware:btn')}
                                        />
                                    </div>
                                </div>
                                <div className="footer">
                                    <Fragment>
                                        <DojotBtnClassic label={t('discard.label')} type="secondary" onClick={toogleSidebarImages} />
                                        <DojotBtnClassic color="red" label={t('firmware:labels.apply')} type="primary" onClick={e => this.callApplyImage(e)} />
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
                    images={images}
                    toogleSidebarFirmware={this.toogleSidebarFirmImage}
                />
            </Fragment>
        );
    }
}


SidebarImage.defaultProps = {
    showSidebarImage: false,
    deviceId: '',
    is: {},
    ds: {},
};

SidebarImage.propTypes = {
    t: PropTypes.func.isRequired,
    deviceId: PropTypes.string,
    showSidebarImage: PropTypes.bool,
    toogleSidebarImages: PropTypes.func.isRequired,
    is: PropTypes.shape({
        images: PropTypes.array,
    }),
    ds: PropTypes.shape({
        devices: PropTypes.array,
    }),
};


class FirmwareWebSocket extends Component {
    constructor(props) {
      super(props);
    }

    componentDidMount() {
      console.log("FirmwareWebSocket: componentDidMount:");
      const rsi = this.props.onChange;
      const socketio = require("socket.io-client");
      const target = `${window.location.protocol}//${window.location.host}`;
      const token_url = `${target}/stream/socketio`;

      function _getWsToken() {
        util
          ._runFetch(token_url)
          .then((reply) => {
            init(reply.token);
          })
          .catch((error) => {
            toaster.error(error);
          });
      }

      function init(token) {
        imageSocket = socketio(target, {
          query: `token=${token}`,
          transports: ["polling"],
        });
        imageSocket.on("all", (data) => {
          onChange(data);
        });

        imageSocket.on("error", (data) => {
          if (imageSocket !== null) imageSocket.close();
        });
      }
      _getWsToken();
    }

    componentWillUnmount() {
      if (imageSocket !== null) imageSocket.close();
    }

    render() {
      return null;
    }
  }

FirmwareWebSocket.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default withNamespaces()(SidebarImage);
