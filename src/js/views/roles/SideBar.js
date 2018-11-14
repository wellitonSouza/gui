import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

function Btn(params) {
    console.log(params);
    return (
        <button
            type="button"
            title={params.alt}
            onClick={params.click}
            className={`material-btn center-text-parent center-middle-flex ${params.class}`}
            id={params.modalId}
        >
            <span className="text center-text-child">
                {params.label}
            </span>
        </button>
    );
}

class SideBarRight extends Component {
    /*     constructor() {
            super();
             this.state = {
                modal: {
                    show: false,
                    actionClick: null,
                    modalTitle: '',
                },
            }; 
            this.showModal = this.showModal.bind(this);
        } */

    /*     showModal(e) {
            e.preventDefault();
            const { id } = e.currentTarget;
            const { buttonsFooter } = this.props;
            const btn = buttonsFooter[id];
    
            this.setState({
                modal: {
                    show: true,
                    actionClick: btn.click,
                    modalTitle: btn.modalConfirmText,
                },
            });
        } */

    render() {
        const { visible, title, buttonsFooter, content } = this.props;
        /*         const { modal } = this.state;
         */
        let body = null;
        let header = null;
        let btnsFooter = null;
        /*         let modalContent = null; */
        if (visible) {
            header = (
                <div id="auth-title" className="title">
                    <span id="title-text" className="title-text">
                        {title}
                    </span>
                </div>);

            /*             if (buttonsFooter !== null && buttonsFooter.length > 0) {
                            btnsFooter = buttonsFooter.map((btn, index) => (
                                <Btn
                                    label={btn.label}
                                    click={btn.modalConfirm ? this.showModal : btn.click}
                                    alt={btn.alt}
                                    color={btn.color}
                                    modalId={index}
                                />));
                        } */

            if (buttonsFooter !== null && buttonsFooter.length > 0) {
                btnsFooter = buttonsFooter.map(btn => (
                    <Btn
                        label={btn.label}
                        click={btn.click}
                        alt={btn.alt}
                        color={btn.color}
                        class=""
                    />));
            }

            /*             if (modal.show) {
                            const op_type = { label: 'Remove' };
                            modalContent = (<GenericModal title={'treee'} first_message={'test'} openModal={modal.show} click={modal.click} op_type={op_type} btnLabel="Remove" />);
                        }
             */
            body = (
                <ReactCSSTransitionGroup
                    transitionName="sidebarRight"
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


export default (SideBarRight);
