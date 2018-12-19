import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types';
import { DojotCustomButton } from './DojotButton';

class SideBarRight extends Component {
    render() {
        const {
            visible, title, buttonsFooter, content,
        } = this.props;
        let body = null;
        let header = null;
        let btnFooter = null;
        if (visible) {
            header = (
                <div id="auth-title" className="title">
                    <span id="title-text" className="title-text">
                        {title}
                    </span>
                </div>);
            if (buttonsFooter !== null && buttonsFooter.length > 0) {
                btnFooter = buttonsFooter.map(btn => (
                    <DojotCustomButton label={btn.label} onClick={btn.click} type={btn.type} />
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
                                {btnFooter}
                            </div>
                        </div>
                    </div>
                </ReactCSSTransitionGroup>);
        }

        return body;
    }
}

SideBarRight.propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string.isRequired,
    buttonsFooter: PropTypes.shape.isRequired,
    content: PropTypes.shape.isRequired,
};

SideBarRight.defaultProps = {
    visible: true,
};
export default (SideBarRight);
