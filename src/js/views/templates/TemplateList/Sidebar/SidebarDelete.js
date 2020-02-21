import React from 'react';
import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';

import { DojotBtnClassic } from 'Components/DojotButton';
import { withNamespaces } from 'react-i18next';

const SidebarDelete = ({
    showSidebar, message, cancel, confirm, t, numOfDevPage,
}) => (
    <Slide right when={showSidebar} duration={300}>
        {
            showSidebar
                ? (
                    <div className="sidebar-delete">
                        <div className="header">
                            <div className="title">
                                {t('templates:title_sidebar.default')}
                            </div>
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
                                <DojotBtnClassic
                                    type="secondary"
                                    label={t('cancel.label')}
                                    onClick={cancel}
                                />
                                <DojotBtnClassic
                                    color="red"
                                    type="primary"
                                    label={t('confirm.label')}
                                    onClick={confirm}
                                    numOfDevPage={numOfDevPage}
                                />
                            </div>
                        </div>
                    </div>
                )
                : <div />
        }
    </Slide>
);

SidebarDelete.defaultProps = {
    showSidebar: false,
    numOfDevPage: PropTypes.number,
};

SidebarDelete.propTypes = {
    showSidebar: PropTypes.bool,
    message: PropTypes.string.isRequired,
    cancel: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    numOfDevPage: PropTypes.number,
};
export default withNamespaces()(SidebarDelete);
