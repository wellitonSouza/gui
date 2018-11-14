import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import toaster from '../../comms/util/materialize';
import { GenericModal } from '../../components/Modal';


function Modal(params) {
    return (<GenericModal title={params.title} first_message={params.first_message} openModal={this.openModal} click={this.remove} op_type={op_type} btnLabel="Remove" />);
}
function Btn(params) {
    // const showModal = params.modalConfirm ? params

    return (
        <button
            type="button"
            title={params.alt}
            onClick={params.click}
            className="material-btn center-text-parent center-middle-flex"
        >
            <span className="text center-text-child">
                {params.label}
            </span>
        </button>
    );
}

class SideBarRight extends Component {

    render() {
        const { visible, title, buttonsFooter, content } = this.props;

        let body = null;
        let header = null;
        let btnsFooter = null;
        if (visible) {
            header = (
                <div id="auth-title" className="title">
                    <span id="title-text" className="title-text">
                        {title}
                    </span>
                </div>);

            if (buttonsFooter !== null && buttonsFooter.length > 0) {
                btnsFooter = buttonsFooter.map(btn => (
                    <Btn label={btn.label} click={btn.click} alt={btn.alt} color={btn.color} modalConfirm={btn.modalConfirm} modalConfirmText={btn.modalConfirmText} />));
            }

            body = (
                <ReactCSSTransitionGroup
                    transitionName="sidebar"
                    transitionAppear
                    transitionAppearTimeout={500}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    <div id="sidebar" className="sidebar-auth visible">
                        {header}
                        <div className="fixed-height">
                            {content}
                            <div id="edit-footer" className="action-footer">
                                {btnsFooter}
                            </div>
                        </div>
                    </div>
                </ReactCSSTransitionGroup>);
        }

        return body;
    }

}


export default (SideBar);
