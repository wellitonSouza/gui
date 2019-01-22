import React from 'react';
import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';

import { DojotBtnClassic } from 'Components/DojotButton';

const SidebarDelete = ({
    showSidebar, message, cancel, confirm,
}) => (
    <Slide right when={showSidebar} duration={300}>
        {
            showSidebar
                ? (
                    <div className="sidebar-delete">
                        <div className="header">
                            <div className="title">manage template</div>
                            <div className="icon">
                                <img src="images/icons/template-cyan.png" alt="device-icon" />
                            </div>
                        </div>
                        <div className="body">
                            <div className="sidebar-delete-message">
                                {message}
                            </div>
                        </div>
                        <div className="footer">
                            <div className="sidebar-delete-action">
                                <DojotBtnClassic type="secondary" label="cancel" onClick={cancel} />
                                <DojotBtnClassic color="red" type="primary" label="confirm" onClick={confirm} />
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
