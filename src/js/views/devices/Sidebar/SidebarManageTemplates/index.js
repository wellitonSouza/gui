import React from 'react';
import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';
import { DojotCustomButton } from 'Components/DojotButton';
import MaterialInput from 'Components/MaterialInput';
import TemplateItem from './TemplateItem';

const SidebarManageTemplates = ({ showSidebar, handleShowManageTemplate }) => (
    <Slide right when={showSidebar} duration={300}>
        {
            showSidebar
                ? (
                    <div className="manage-templates">
                        <div className="header">
                            <div className="title">
                                manage template
                            </div>
                            <div className="icon">
                                <img src="images/icons/template-cyan.png" alt="template-icon" />
                            </div>
                        </div>
                        <div className="body">
                            <div className="title">
                                {'new device > set template'}
                            </div>

                            <div className="template-filter">
                                <div className="label">Select any templates</div>
                                <div className="template-filter-input">
                                    <MaterialInput
                                        className="filter"
                                        name="filter"
                                        maxLength={40}
                                    >
                                        Filter By Name
                                    </MaterialInput>
                                    <button type="button" className="template-filter-button">
                                        <i className="fa fa-search" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                            <div className="divider" />
                            <div className="template-list">
                                <TemplateItem template={{ label: 'template 1', attrs: [] }} checked />
                                <TemplateItem template={{ label: 'template 2', attrs: [] }} />
                                <TemplateItem template={{ label: 'template 3', attrs: [] }} checked />
                            </div>

                        </div>

                        <div className="footer">
                            <DojotCustomButton label="back" onClick={handleShowManageTemplate} />
                        </div>
                    </div>
                )
                : <div />
        }
    </Slide>
);

SidebarManageTemplates.defaultProps = {
    showSidebar: false,
};

SidebarManageTemplates.propTypes = {
    showSidebar: PropTypes.bool,
    handleShowManageTemplate: PropTypes.func.isRequired,
};


export default SidebarManageTemplates;
