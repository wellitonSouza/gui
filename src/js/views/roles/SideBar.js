import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import MaterialSelect from '../../components/MaterialSelect';
import UserActions from '../../actions/UserActions';
import toaster from '../../comms/util/materialize';
import { RemoveModal } from '../../components/Modal';

function Btn(params) {
    return (
        /*         <div role="button" className="material-btn center-text-parent center-middle-flex" onClick={params.click} title={params.alt}>
                    <span className="text center-text-child">{params.label}</span>
                </div> */
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
            <div id="sidebar" className="sidebar-auth visible">
                {header}
                <div className="fixed-height">
                    {params.content}
                    <div id="edit-footer" className="action-footer">
                        {btnsFooter}
                    </div>
                </div>
            </div>);
    }

    return body;
}


export default translate()(SideBar);
