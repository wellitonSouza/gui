import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    DojotBtnClassic,
} from '../DojotButton';

export default class ModalAlert extends Component {
    constructor(props) {
        super(props);

        this.dismiss = this.dismiss.bind(this);
    }

    dismiss() {
        const { openModal } = this.props;
        openModal(false);
    }

    render() {
        const {
            title, firstMessage, label, click, img, cancel, back,
        } = this.props;
        return (
            <div className="">
                <div className="row confirm-modal-import">
                    <div className="confirm-modal-head">
                        <div className="col s4 img-alert">
                            <div><i className={`fa fa-${img} fa-4x`} /></div>
                        </div>
                        <div className="col s8 message">
                            <div className="message-title">{title}</div>
                            <div className="message-subtitle">{firstMessage}</div>
                        </div>
                    </div>
                    <div className="col s12 text-right">
                        {cancel ? (
                            <DojotBtnClassic
                                is_secondary
                                onClick={this.dismiss}
                                label="Cancel"
                                title="Cancel"
                            />
                        ) : null}
                        <DojotBtnClassic
                            is_secondary={false}
                            onClick={() => click()}
                            label={label}
                            title={label}
                        />
                    </div>
                </div>
                <div className="modal-background" onClick={back} onKeyPress={back} role="button" tabIndex={0} />
            </div>
        );
    }
}
ModalAlert.defaultProps = {
    cancel: false,
};

ModalAlert.propTypes = {
    openModal: PropTypes.func.isRequired,
    click: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    firstMessage: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    cancel: PropTypes.bool,
    back: PropTypes.func.isRequired,
};
