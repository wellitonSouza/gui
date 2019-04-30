import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';
import { DojotBtnClassic } from 'Components/DojotButton';
import ImageActions from 'Actions/ImageActions';
import HistoryActions from 'Actions/HistoryActions';
import MaterialSelect from 'Components/MaterialSelect';
import SidebarFirmImages
    from 'Views/templates/TemplateList/Sidebar/SidebarFirmware/SidebarFirmImages';
import SidebarButton from 'Views/templates/TemplateList/Sidebar/SidebarButton';
import DeviceActions from 'Actions/DeviceActions';
import toaster from 'Comms/util/materialize';
import { withNamespaces } from 'react-i18next';
import ability from 'Components/permissions/ability';
import { GenericModal } from 'Components/Modal';
import FirmwareWebSocket from './FirmwareWebSocket';

const FW_RESULT_META_LABEL = 'dojot:firmware_update:update_result';
const FW_VERSION_META_LABEL = 'dojot:firmware_update:version';
const FW_STATE_META_LABEL = 'dojot:firmware_update:state';
const FW_TRANSFER_META_LABEL = 'dojot:firmware_update:desired_version';
const FW_APPLY_META_LABEL = 'dojot:firmware_update:update';


const StateFirmwareDevice = (props) => {
    const {
        version, state, result, transferred, t,
    } = props;
    return (
        <div className="info firmware-enabled">
            <div className="title-info">
                {t('firmware:title_info')}
            </div>
            <div className="desc">
                <div className="info-group">
                    <div className="label">
                        {t('firmware:default_attrs.current_version')}
                    </div>

                    <div className="value">
                        {version || t('firmware:no_data')}
                    </div>
                </div>
                <div className="info-group">
                    <div className="label">
                        {t('firmware:default_attrs.state')}
                    </div>
                    <div className="value">
                        {state !== undefined ? `${t(`firmware:state.${state}`)} (${state})` : t('firmware:no_data')}
                    </div>
                </div>
                <div className="info-group">
                    <div className="label">
                        {t('firmware:default_attrs.update_result')}
                    </div>
                    <div className="value">
                        {result !== undefined ? `${t(`firmware:result.${result}`)} (${result})` : t('firmware:no_data')}
                    </div>
                </div>
                <div className="info-group">
                    <div className="label">
                        {t('firmware:default_attrs.update_result')}
                        {' '}
Trans
                    </div>
                    <div className="value">
                        {transferred !== undefined ? transferred : t('firmware:no_data')}
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

function BtnActionImgFirmware(props) {
    const {
        title, label, onClick, enable,
    } = props;
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            onKeyPress={onClick}
            className={`new-btn-flat style-2 primary ${enable ? 'btn-enable' : 'btn-disable'}`}
        >
            {label}
        </button>
    );
}

BtnActionImgFirmware.propTypes = {
    title: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    enable: PropTypes.bool.isRequired,
};

const ImgToTransfer = (props) => {
    const {
        currentImgId,
        onChange,
        options,
        onClickBtnTransfer,
        onClickBtnApply,
        t,
        enableBtnTransfer,
        enableBtnApply,
    } = props;

    return (
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
            <div className="btn-action">
                <BtnActionImgFirmware
                    title={t('firmware:labels.transfer_alt')}
                    onClick={onClickBtnTransfer}
                    enable={enableBtnTransfer}
                    label={t('firmware:labels.transfer')}
                />
            </div>
            <div className="btn-action">
                <BtnActionImgFirmware
                    title={t('firmware:labels.apply_alt')}
                    onClick={onClickBtnApply}
                    enable={enableBtnApply}
                    label={t('firmware:labels.apply')}
                />
            </div>
        </div>
    );
};

ImgToTransfer.propTypes = {
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.any).isRequired,
    onClickBtnTransfer: PropTypes.func.isRequired,
    currentImgId: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    onClickBtnApply: PropTypes.func.isRequired,
    enableBtnApply: PropTypes.bool.isRequired,
    enableBtnTransfer: PropTypes.bool.isRequired,
};

class SidebarImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            showFirmwareImage: false,
            showApplyModal: false,
            attrs: {
                fwUpdateState: undefined,
                fwUpdateResult: undefined,
                fwUpdateVersion: undefined,
                fwUpdateTransferred: undefined,
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
        this.showModalApply = this.showModalApply.bind(this);
        this.handleModalApply = this.handleModalApply.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.templateIdAllowedImage !== state.templateIdAllowedImage) {
            return {
                ...state,
                templateIdAllowedImage: props.templateIdAllowedImage,
                loaded: false,
            };
        }

        if (state.attrs.fwUpdateVersion === undefined
            || state.attrs.fwUpdateResult === undefined
            || state.attrs.fwUpdateState === undefined
            || state.attrs.fwUpdateTransferred === undefined) {
            const { is: { history } } = props;
            return {
                ...state,
                attrs: {
                    ...state.attrs,
                    fwUpdateVersion: history.version,
                    fwUpdateState: history.state,
                    fwUpdateResult: history.result,
                    fwUpdateTransferred: history.transfer,
                },
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

            const stateLbAttr = this.getAttrLabel(FW_STATE_META_LABEL);
            const resultLbAttr = this.getAttrLabel(FW_RESULT_META_LABEL);
            const versionLbAttr = this.getAttrLabel(FW_VERSION_META_LABEL);
            const transLbAttr = this.getAttrLabel(FW_TRANSFER_META_LABEL);

            HistoryActions.fetchLastAttrDataByDeviceIDAndAttrLabel.defer(deviceId, stateLbAttr, 'state');
            HistoryActions.fetchLastAttrDataByDeviceIDAndAttrLabel.defer(deviceId, resultLbAttr, 'result');
            HistoryActions.fetchLastAttrDataByDeviceIDAndAttrLabel.defer(deviceId, versionLbAttr, 'version');
            HistoryActions.fetchLastAttrDataByDeviceIDAndAttrLabel.defer(deviceId, transLbAttr, 'transfer');

            this.setState({
                loaded: true,
            });
        }
    }

    onChangeImage(e) {
        const newImageId = e.target.value;
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

    getLabelImageFromId(imageId) {
        let label = null;
        const { is: { images } } = this.props;
        if (Object.keys(images).length) {
            Object.values(images)
                .forEach((el) => {
                    if (el.id === imageId) {
                        label = el.fw_version;
                    }
                });
        }
        return label;
    }

    receivedImageInformation(data) {
        const { attrs: attrsReceive } = data;
        const { attrs } = this.state;


        const state = attrsReceive[this.getAttrLabel(FW_STATE_META_LABEL)];
        console.log('receivedImageInformation', state);
        if (state) {
            attrs.fwUpdateState = state;
        }
        const result = attrsReceive[this.getAttrLabel(FW_RESULT_META_LABEL)];
        if (result) {
            attrs.fwUpdateResult = result;
        }
        const version = attrsReceive[this.getAttrLabel(FW_VERSION_META_LABEL)];
        if (version) {
            attrs.fwUpdateVersion = version;
        }
        const transferred = attrsReceive[this.getAttrLabel(FW_TRANSFER_META_LABEL)];
        if (version) {
            attrs.fwUpdateTransferred = transferred;
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

        const uploadImageAlias = this.getAttrLabel(FW_TRANSFER_META_LABEL);
        const dataToBeSent = { attrs: {} };
        dataToBeSent.attrs[uploadImageAlias] = images[currentImageId].fw_version;
        DeviceActions.triggerActuator(deviceId, dataToBeSent, () => {
            toaster.warning(t('firmware:alerts.image_transferred'));
        });
    }

    callApplyImage() {
        const { t, deviceId } = this.props;
        const applyAlias = this.getAttrLabel(FW_APPLY_META_LABEL);
        const dataToBeSent = { attrs: {} };
        dataToBeSent.attrs[applyAlias] = '1';
        // value used to notify device to apply its image

        DeviceActions.triggerActuator(deviceId, dataToBeSent, () => {
            toaster.warning(t('firmware:alerts.image_applied'));
        });

        this.setState({ showApplyModal: false });
    }

    toogleSidebarFirmImage() {
        const { showFirmwareImage } = this.state;
        this.setState({
            showFirmwareImage: !showFirmwareImage,
        });
    }

    createImageOptions() {
        const { t } = this.props;
        const items = [];
        items.push(<option key="selectedImage" value="0">{t('firmware:select_image')}</option>);
        const { is: { images } } = this.props;
        if (Object.keys(images).length) {
            Object.values(images)
                .forEach((el) => {
                    items.push(<option key={el.id} value={el.id}>{el.fw_version}</option>);
                });
        }
        return items;
    }


    showModalApply() {
        this.setState({ showApplyModal: true });
    }

    handleModalApply(status) {
        this.setState({ showApplyModal: status });
    }

    render() {
        const {
            t, toogleSidebarImages, showSidebarImage, is, deviceId,
        } = this.props;
        const { images } = is;
        const {
            attrs, showFirmwareImage, templateIdAllowedImage, currentImageId, showApplyModal,
        } = this.state;
        const listAvailableOptionsImages = this.createImageOptions();
        const fwImageModifier = ability.can('modifier', 'fw-image');

        const { fwUpdateState: state, fwUpdateResult: result, fwUpdateTransferred: transferredVersion } = attrs;

        // enable Transfer if state is 0 or 2  and img was selected
        let enableBtnTransfer = false;
        if (state === 0 && currentImageId !== '0') {
            enableBtnTransfer = true;
        }

        // enable apply img if state=2 and result=0 ou 8
        let enableBtnApply = false; // maybe dont make sense result === undefined
        if (state === 2 && (result === 0 || result === 8 || result === undefined)) {
            enableBtnApply = true;
        }

        /* console.log('props state', this.props, this.state); */

        return (
            <Fragment>
                {showApplyModal ? (
                    <GenericModal
                        title={t('firmware:labels.title_modal_apply')}
                        first_message={t('firmware:labels.qst_apply_image', {
                            image: transferredVersion,
                        })}
                        openModal={this.handleModalApply}
                        click={this.callApplyImage}
                        op_type={{ label: t('firmware:labels.btn_apply') }}
                    />
                ) : <div />}
                <FirmwareWebSocket onChange={this.receivedImageInformation} deviceId={deviceId} />
                <Slide right when={showSidebarImage} duration={300}>
                    {showSidebarImage
                        ? (
                            <div className="sidebar-firmware">
                                <div className="header">
                                    <div className="title">{t('firmware:update_firmware')}</div>
                                    <div className="icon">
                                        <img src="images/firmware-red.png" alt="firmware-icon" />
                                    </div>
                                    <div className="header-path">
                                        {`${t('devices:device')} > ${t('firmware:update_firmware')}`}
                                    </div>
                                </div>

                                <div className="body box-image-info">
                                    <div className="sub-content">
                                        <div className="body-form-fw">
                                            <ImgToTransfer
                                                currentImgId={this.currentImageId}
                                                onChange={e => this.onChangeImage(e)}
                                                options={listAvailableOptionsImages}
                                                onClickBtnTransfer={this.callUploadImage}
                                                onClickBtnApply={this.showModalApply}
                                                enableBtnTransfer={enableBtnTransfer}
                                                enableBtnApply={enableBtnApply}
                                                t={t}
                                            />
                                            <StateFirmwareDevice
                                                version={attrs.fwUpdateVersion}
                                                result={attrs.fwUpdateResult}
                                                state={attrs.fwUpdateState}
                                                transferred={attrs.fwUpdateTransferred}
                                                t={t}
                                            />
                                        </div>

                                    </div>
                                    <div className="body-actions">
                                        <SidebarButton
                                            onClick={() => this.toogleSidebarFirmImage()}
                                            icon="firmware"
                                            text={t('firmware:btn_manage_images')}
                                            title={t('firmware:btn_manage_images_alt')}
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
                        : <div />
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
