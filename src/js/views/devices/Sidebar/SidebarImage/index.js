import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';
import { DojotBtnClassic } from 'Components/DojotButton';
import ImageActions from 'Actions/ImageActions';
import MaterialSelect from 'Components/MaterialSelect';
import SidebarFirmImages
    from 'Views/templates/TemplateList/Sidebar/SidebarFirmware/SidebarFirmImages';
import SidebarButton from 'Views/templates/TemplateList/Sidebar/SidebarButton';
import DeviceActions from 'Actions/DeviceActions';
import toaster from 'Comms/util/materialize';
import { withNamespaces } from 'react-i18next';
import ability from 'Components/permissions/ability';
import FirmwareWebSocket from './FirmwareWebSocket';

const StateFirmwareDevice = (props) => {
    const {
        version, state, result, t,
    } = props;
    return (
        <div className="info firmware-enabled">
            <div className="icon">
                <img
                    src="images/icons/firmware-big-gray.png"
                    alt="device-icon"
                />
            </div>
            <div className="title-info">
                {t('firmware:title_info')}
            </div>
            <div className="desc">
                <div className="info-group">
                    <div className="label">
                        {t('firmware:default_attrs.current_version')}
                    </div>

                    <div className="value">
                        {version}
                    </div>
                </div>
                <div className="info-group">
                    <div className="label">
                        {t('firmware:default_attrs.state')}
                    </div>
                    <div className="value">
                        {state}
                    </div>
                </div>
                <div className="info-group">
                    <div className="label">
                        {t('firmware:default_attrs.update_result')}
                    </div>
                    <div className="value">
                        {result}
                    </div>
                </div>
            </div>
        </div>
    );
};

StateFirmwareDevice.propTypes = {
    result: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
};

const ImgToTransfer = (props) => {
    const {
        currentImgId, onChange, options, onClickBtnTransfer, onClickBtnApply, t,
    } = props;

    return (
        <Fragment>
            <div className="image-up">
                <div className="header2">
                    {t('firmware:alerts.image_to_transfer')}
                </div>
                <div className="cid_select">
                    <MaterialSelect
                        id="flr_images"
                        name="images"
                        label={t('firmware:labels.available')}
                        value={currentImgId}
                        onChange={onChange}
                    >
                        {options}
                    </MaterialSelect>
                </div>
                {/*                <div className="cid_upload_button">*/}
                {/*                <div
                    className="square-button"
                    onKeyPress={onKeyPress}
                    tabIndex="0"
                    role="button"
                    onClick={onKeyPress}
                >
                    <i className="fa fa-download fa-2x" />
                    {t('firmware:labels.transfer')}
                </div> */}
                {/*                <DojotBtnClassic
                    color="gray"
                    label={t('firmware:labels.transfer')}
                    type="primary"
                    onClick={e => this.callApplyImage(e)}
                />*/}
                <div className="btn-action">
                    <button
                        type="button"
                        title={t('firmware:labels.transfer')}
                        onClick={onClickBtnTransfer}
                        onKeyPress={onClickBtnTransfer}
                        className="new-btn-flat style-2 primary clr-gray"
                    >
                        {t('firmware:labels.transfer')}
                    </button>

                    {/*                    <DojotBtnClassic
                        color="red"
                        label={t('firmware:labels.apply')}
                        type="primary"
                        onClick={e => this.callApplyImage(e)}
                    />*/}
                </div>
                <div className="btn-action">
                    <button
                        type="button"
                        title={t('firmware:labels.apply')}
                        onClick={onClickBtnApply}
                        onKeyPress={onClickBtnApply}
                        className="new-btn-flat style-2 primary clr-gray"
                    >
                        {t('firmware:labels.apply')}
                    </button>
                </div>
            </div>
        </Fragment>
    );
};

ImgToTransfer.propTypes = {
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.any).isRequired,
    onClickBtnTransfer: PropTypes.func.isRequired,
    currentImgId: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    onClickBtnApply: PropTypes.func.isRequired,
};

class SidebarImage extends Component {
    constructor(props) {
        super(props);
        const { t } = props;
        this.state = {
            loaded: false,
            showFirmwareImage: false,
            attrs: {
                fwUpdateState: t('firmware:no_data'),
                fwUpdateResult: t('firmware:no_data'),
                fwUpdateVersion: t('firmware:no_data'),
                fwUpdateStateCode: 0,
                fwUpdateResultCode: 0,
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

    onChangeImage(e) {
        const newImageId = e.target.currentImgId;
        this.setState({
            currentImageId: newImageId,
        });
    }

    getAttrLabel(labelMeta) {
        const { deviceId, ds } = this.props;
        const { templateIdAllowedImage: templateId } = this.state;
        const device = ds.devices[deviceId];
        let relatedLabel = '';
        device.attrs[templateId].forEach((attr) => {
            if (attr.metadata) {
                const el = attr.metadata.filter(meta => meta.label === labelMeta);
                if (el.length) {
                    relatedLabel = attr.label;
                } // found the attr
            }
        });
        return relatedLabel;
    }

    receivedImageInformation(data) {
        const { attrs: attrsReceive } = data;
        const { attrs } = this.state;
        const { t } = this.props;

        const state = attrsReceive[this.getAttrLabel('dojot:firmware_update:state')];
        if (state) {
            attrs.fwUpdateState = `${t(`firmware:state.${state}`)} (${state})`;
            attrs.fwUpdateStateCode = state;
        }

        const result = attrsReceive[this.getAttrLabel('dojot:firmware_update:update_result')];
        if (result) {
            attrs.fwUpdateResult = `${t(`firmware:result.${result}`)} (${result})`;
            attrs.fwUpdateResultCode = result;
        }

        const version = attrsReceive[this.getAttrLabel('dojot:firmware_update:version')];
        if (version) {
            attrs.fwUpdateVersion = version;
        }
        this.setState({
            attrs,
        });
    }

    callUploadImage() {
        const { t, deviceId, is: { images } } = this.props;
        const { currentImageId } = this.state;
        if (currentImageId === '0') {
            toaster.warning(t('firmware:alerts.valid_image'));
            return;
        }

        const uploadImageAlias = this.getAttrLabel('dojot:firmware_update:desired_version');
        const dataToBeSent = { attrs: {} };
        dataToBeSent.attrs[uploadImageAlias] = images[currentImageId].fw_version;
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
            Object.values(images)
                .forEach((el) => {
                    items.push(<option key={el.id} value={el.id}>{el.fw_version}</option>);
                });
        }
        return items;
    }


    render() {
        const {
            t, toogleSidebarImages, showSidebarImage, is, deviceId,
        } = this.props;
        const { images } = is;
        const {
            attrs, showFirmwareImage, templateIdAllowedImage, currentImageId,
        } = this.state;
        const listOfOptions = this.createImageOptions();
        const fwImageModifier = ability.can('modifier', 'fw-image');

        const { fwUpdateState: state, fwUpdateUpdateResult: result } = attrs;

        // enable Transfer if state is 0 or 2  and img was selected
        let enableBtnTransfer = false;
        if (state === 0 && currentImageId !== '0') {
            enableBtnTransfer = true;
        }

        // enable apply img if state=2 and result=0 ou 8
        let enableBtnApply = false;
        if (state === 2 && (result === 0 || result === 8)) {
            enableBtnApply = true;
        }


        return (
            <Fragment>
                <FirmwareWebSocket onChange={this.receivedImageInformation} deviceId={deviceId}/>
                <Slide right when={showSidebarImage} duration={300}>
                    {showSidebarImage
                        ? (
                            <div className="sidebar-firmware">
                                <div className="header">
                                    <div className="title">ATUALIZAÇÃO DE FIRMWARE</div>
                                    <div className="icon">
                                        <img src="images/firmware-red.png" alt="firmware-icon"/>
                                    </div>
                                    <div className="header-path">
                                        {'dispositivo > ATUALIZAÇÃO DE FIRMWARE'}
                                    </div>
                                </div>

                                <div className="body box-image-info">
                                    <div className="sub-content">
                                        <div className="body-form-fw">
                                            <ImgToTransfer
                                                currentImgId={this.currentImageId}
                                                onChange={e => this.onChangeImage(e)}
                                                options={listOfOptions}
                                                onClickBtnTransfer={this.callUploadImage}
                                                onClickBtnApply={this.callApplyImage}
                                                enableBtnTransfer={enableBtnTransfer}
                                                enableBtnApply={enableBtnApply}
                                                t={t}
                                            />
                                            <StateFirmwareDevice
                                                version={attrs.fwUpdateVersion}
                                                result={attrs.fwUpdateResult}
                                                state={attrs.fwUpdateState}
                                                t={t}
                                            />
                                        </div>

                                    </div>
                                    <div className="body-actions">
                                        {/* <div className="body-actions--divider" /> */}
                                        <SidebarButton
                                            onClick={() => this.toogleSidebarFirmImage()}
                                            icon="firmware"
                                            text={t('firmware:btn')}
                                        />
                                    </div>
                                </div>
                                <div className="footer">
                                    <Fragment>
                                        <DojotBtnClassic
                                            label="Fechar atualização de firmware"
                                            type="secondary"
                                            onClick={toogleSidebarImages}
                                        />
                                    </Fragment>
                                </div>
                            </div>
                        )
                        : <div/>
                    }
                </Slide>
                {fwImageModifier
                    ? (
                        <SidebarFirmImages
                            showFirmware={showFirmwareImage}
                            templateId={templateIdAllowedImage}
                            images={images}
                            toogleSidebarFirmware={this.toogleSidebarFirmImage}
                        />
                    ) : null}
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


export default withNamespaces()(SidebarImage);
