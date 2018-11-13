import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import toaster from '../../comms/util/materialize';
import { GenericModal } from '../../components/Modal';

function Btn(params) {
/*     <GenericModal title={title} first_message={first_message} openModal={this.openModal} click={this.remove} op_type={op_type} btnLabel="Remove" />
      */
    return (
         <button type="button" title={params.alt} onClick={params.click} className="material-btn center-text-parent center-middle-flex">
            <span className="text center-text-child">
                {params.label}
            </span>
        </button>
    );
}

function SideBar(params) {
    let body = null;
    let header = null;
    let btnsFooter = null;
    if (params.visible) {
        header = (
            <div id="auth-title" className="title">
                <span id="title-text" className="title-text">
                    {params.title}
                </span>
            </div>);

        if (params.buttonsFooter !== null && params.buttonsFooter.length > 0) {
            btnsFooter = params.buttonsFooter.map(btn => (
                <Btn label={btn.label} click={btn.click} alt={btn.alt} color={btn.color} />));
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
                        {params.content}
                        <div id="edit-footer" className="action-footer">
                            {btnsFooter}
                        </div>
                    </div>
                </div>
            </ReactCSSTransitionGroup>);
    }

    return body;
}


export default (SideBar);
