import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { DojotCustomButton } from './DojotButton';

//TODO move Component to folder Components
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
                    <DojotCustomButton label={btn.label} onClick={btn.click} type={btn.type}/>
                ));
            }
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
