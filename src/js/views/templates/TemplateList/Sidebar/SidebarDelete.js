import React from 'react';
import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';

import { DojotCustomButton } from 'Components/DojotButton';

const SidebarDelete = ({
    showSidebar, message, cancel, confirm,
}) => (
    <Slide right when={showSidebar} duration={300}>
        {
            showSidebar
                ? (
                    <div className="sidebar-delete">
                        <div className="header">
                            <span className="header-path">delete</span>
                        </div>
                        <div className="body">
                            <div className="sidebar-delete-message">
                                {message}
                            </div>
                        </div>
                        <div className="footer">
                            <div className="sidebar-delete-action">
                                <DojotCustomButton label="cancel" onClick={cancel} type="default" />
                                <DojotCustomButton label="confirm" onClick={confirm} type="secondary" />
                            </div>
                        </div>
                    </div>
                )
                : <div />
        }
    </Slide>
);

SidebarDelete.defaultProps = {
    message: 'Do you really want to remove it?',
    showSidebar: false,
};

SidebarDelete.propTypes = {
    showSidebar: PropTypes.bool,
    message: PropTypes.string,
    cancel: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
};

export default SidebarDelete;
