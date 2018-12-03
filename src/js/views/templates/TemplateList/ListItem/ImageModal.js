import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { ImageCard, NewImageCard } from '../../../firmware/elements';

// this component is pretty similar to FirmwareCardImpl
class ImageModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            creating: false,
        };

        this.images = [];
        this.dismiss = this.dismiss.bind(this);
        // this.toggleModal = this.toggleModal.bind(this);
        this.createNewImage = this.createNewImage.bind(this);
        this.setNewImage = this.setNewImage.bind(this);
    }

    createNewImage() {
        this.setState({ creating: true });
    }

    setNewImage(value) {
        this.setState({ creating: value });
    }

    dismiss() {
        // console.log('dismiss');
        this.props.toggleModal();
    }


    // toggleModal() {
    //     this.props.toggleModal();
    // }

    render() {
        // console.log("Rendering Image Modal", this.props);

        const images = [];
        for (const img in this.props.images) images.push(this.props.images[img]);

        let default_version = this.props.template.config_attrs.filter(
            (elem, index) => elem.type === 'fw_version',
        )[0];
        if (default_version) default_version = default_version.static_value;
        // console.log("default fw_version: ", default_version);

        return (

            <div className="image-modal-canvas">
                <div className="full-background" onClick={this.dismiss} />
                <ReactCSSTransitionGroup transitionName="imageModal">

                    <div className="image-modal-div imageModal">
                        <div className="row im-header">
                            <div className="col s12 pl40">
                                <div className="icon-firmware" />

                                <label className="title truncate" title={this.props.template.label}>{this.props.template.label}</label>
                                <label className="subtitle">Firmware Management</label>
                            </div>
                        </div>

                        <div className="col s12">
                            <div className="card-size card-size-clear">
                                <div className="attr-area">
                                    {images.map((img, idx) => (
                                        <ImageCard updateDefaultVersion={this.props.updateDefaultVersion} template_id={this.props.template.id} image={img} key={idx} default_version={default_version} />
                                    ))}
                                    {this.state.creating === false && (
                                        <div className="image-card image-card-attributes">
                                            <div onClick={this.createNewImage} className="lst-blockquote col s12">
                                                <span className="new-image-text"> Create a new Image</span>
                                            </div>
                                        </div>
                                    )}
                                    {this.state.creating === true && <NewImageCard refreshImages={this.props.refreshImages} setNewImage={this.setNewImage} template={this.props.template} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </ReactCSSTransitionGroup>

            </div>
        );
    }
}

export default ImageModal;
