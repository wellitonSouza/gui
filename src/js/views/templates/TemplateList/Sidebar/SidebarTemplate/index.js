import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Slide from 'react-reveal/Slide';
import { DojotCustomButton } from 'Components/DojotButton';
import SidebarForm from './SidebarForm';
import SidebarDelete from '../SidebarDelete';
import { templateType } from '../../../TemplatePropTypes';

const SidebarTemplate = ({
    template,
    showSidebar,
    toogleSidebar,
    toogleSidebarAttribute,
    changeValue,
    saveTemplate,
    updateTemplate,
    isNewTemplate,
    toogleSidebarDelete,
    deleteTemplate,
    showDeleteTemplate,
}) => (
    <Fragment>
        <Slide right when={showSidebar} duration={300}>
            { showSidebar
                ? (
                    <div className="template-sidebar">
                        <div className="header">
                            <span className="header-path">template</span>
                        </div>
                        <SidebarForm
                            template={template}
                            toogleSidebarAttribute={toogleSidebarAttribute}
                            changeValue={changeValue}
                        />
                        <div className="footer">
                            <DojotCustomButton label="discard" type="default" onClick={() => toogleSidebar()} />
                            { isNewTemplate
                                ? <DojotCustomButton label="save" type="primary" onClick={saveTemplate} />
                                : (
                                    <Fragment>
                                        <DojotCustomButton label="delete" type="secondary" onClick={() => toogleSidebarDelete('showDeleteTemplate')} />
                                        <DojotCustomButton label="save" type="primary" onClick={updateTemplate} />
                                    </Fragment>
                                )
                            }
                        </div>
                    </div>)
                : <div />
            }
        </Slide>
        <SidebarDelete
            cancel={() => toogleSidebarDelete('showDeleteTemplate')}
            confirm={deleteTemplate}
            showSidebar={showDeleteTemplate}
            message="You are about to remove this template. Are you sure?"
        />
    </Fragment>
);

SidebarTemplate.defaultProps = {
    showSidebar: false,
    showDeleteTemplate: false,
    isNewTemplate: false,
};

SidebarTemplate.propTypes = {
    template: PropTypes.shape(templateType).isRequired,
    showSidebar: PropTypes.bool,
    toogleSidebar: PropTypes.func.isRequired,
    toogleSidebarAttribute: PropTypes.func.isRequired,
    changeValue: PropTypes.func.isRequired,
    saveTemplate: PropTypes.func.isRequired,
    updateTemplate: PropTypes.func.isRequired,
    isNewTemplate: PropTypes.bool,
    toogleSidebarDelete: PropTypes.func.isRequired,
    deleteTemplate: PropTypes.func.isRequired,
    showDeleteTemplate: PropTypes.bool,
};

export default SidebarTemplate;
