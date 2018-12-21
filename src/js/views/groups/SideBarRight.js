import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DojotCustomButton } from '../../components/DojotButton';

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
                <div id="" className="header">
                    <span id="" className="header-path">
                        {title}
                    </span>
                </div>);
            if (buttonsFooter !== null && buttonsFooter.length > 0) {
                btnFooter = buttonsFooter.map(btn => (
                    <DojotCustomButton label={btn.label} onClick={btn.click} type={btn.type} />
                ));
            }
            body = (
                <div className="template-sidebar">
                    {header}
                    <div className="body">
                        {/*                        <div className="body-template-name">
                            <div className="body-icon">
                                <img
                                    className="title-icon template"
                                    src="images/icons/template-gray.png"
                                    alt=""
                                />
                            </div>
                        </div> */}
                        <div className="body-form">
                            {content}
                        </div>
                    </div>
                    <div className="footer">
                        {btnFooter}
                    </div>
                </div>
            );
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
