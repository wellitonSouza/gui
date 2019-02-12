import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';
import { DojotBtnClassic } from 'Components/DojotButton';
import ImageActions from 'Actions/ImageActions';
import util from 'Comms/util';
import toaster from 'Comms/util/materialize';
import ImageList from './ImageList';

class SidebarFirmImages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newImage: false,
        };
        this.createNewImage = this.createNewImage.bind(this);
        this.changeAttrValue = this.changeAttrValue.bind(this);
        this.removeBinary = this.removeBinary.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.saveImages = this.saveImages.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    componentDidMount() {
        const { isNewTemplate, templateId } = this.props;
        if (!isNewTemplate) {
            ImageActions.fetchImages.defer(templateId);
        }
    }

    onDrop(files, image) {
        ImageActions.updateImageData(image.id, 'file', files);
    }

    createNewImage() {
        const { newImage } = this.state;
        if (newImage) {
            ImageActions.insertEmptyImage({
                id: util.guid(), image_version: '', created: null, new: true, saved: false, image_hash: null,
            });
            this.setState({ newImage: true });
        }
    }

    saveImages(e) {
        e.preventDefault();

        Object.entries(this.props.images).map(([key, image]) => {
            if (!image.saved) {
                // for each non saved image,
                // 1. update or create image
                // 2. upload binary
                // 3. set as saved image
                if (image.new) {
                    const json_img = {
                        label: String(this.props.templateId),
                        fw_version: image.image_version,
                        sha1: null,
                    };
                    ImageActions.triggerInsert(json_img, (img) => {
                        const id_to_be_used = image.id;
                        toaster.success('Image created.');
                        if (image.file) {
                            const img_binary = {
                                id: id_to_be_used,
                                binary: image.file[0],
                            };
                            ImageActions.triggerUpdate(img_binary, () => {
                                toaster.success('Image added.');
                            });
                        }
                        ImageActions.updateImageData(id_to_be_used, 'saved', true);
                    });
                } else {
                    // Todo currently we don't update meta information for images;
                    if (image.file) {
                        const img_binary = {
                            id: image.id,
                            binary: image.file[0],
                        };
                        ImageActions.triggerUpdate(img_binary, () => {
                            toaster.success('Image added.');
                        });
                    }
                    ImageActions.updateImageData(image.id, 'saved', true);
                }
                if (image.new) {
                    this.setState({ newImage: false });
                }
            }
            return null;
        });
    }

    removeBinary(e, image) {
        e.preventDefault();
        ImageActions.triggerRemovalBinary(image.id, () => {
            toaster.success('Image updated.');
        });
    }

    removeImage(e, image) {
        e.preventDefault();

        if (image.new) {
            ImageActions.removeSingle(image.id);
            this.setState({ newImage: false });
        } else {
            ImageActions.triggerRemoval(image, () => {
                toaster.error('Image removed.');
            });
        }
    }

    changeAttrValue(event, attr) {
        event.preventDefault();
        const name = event.target.name;
        const value = event.target.value;
        ImageActions.updateImageData(attr.id, name, value);
    }

    render() {
        const { showFirmware, toogleSidebarFirmware } = this.props;
        console.log('SidebarFirmImages. render', this.props.images, showFirmware);

        return (
            <Fragment>
                <Slide right when={showFirmware} duration={300}>
                    { showFirmware
                        ? (
                            <div className="-sidebar sidebar-attribute sidebar-firmware">
                                <div className="header">
                                    <div className="title">MANAGE IMAGES</div>
                                    <div className="icon">
                                        <img src="images/firmware-red.png" alt="device-icon" />
                                    </div>
                                    <div className="header-path">
                                        {'template > firmware > images'}
                                    </div>
                                </div>

                                <div className="body">
                                    <ImageList list={this.props.images} changeAttrValue={this.changeAttrValue} removeImage={this.removeImage} removeBinary={this.removeBinary} onDrop={this.onDrop} />
                                    {(!this.state.newImage)
                                        ? (
                                            <div className="body-form-nodata clickable" onClick={this.createNewImage}>
                                        Click here to add a new image
                                            </div>
                                        )
                                        : null }
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
            </Fragment>
        );
    }
}


SidebarFirmImages.defaultProps = {
    showFirmware: false,
    isNewTemplate: false,
};

SidebarFirmImages.propTypes = {
    showFirmware: PropTypes.bool,
    isNewTemplate: PropTypes.bool,
    templateId: PropTypes.string.isRequired,
    toogleSidebarFirmware: PropTypes.func.isRequired,

};

export default SidebarFirmImages;
