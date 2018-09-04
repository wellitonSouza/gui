import React from 'react';
import PropTypes from 'prop-types';

import { NewPagination } from '../../utils/Manipulation';
import { CustomHeader } from '../../../containers/full/PageHeader';
// import TemplateFilter from './TemplateFilter';


const TemplateHeader = ({
    tempOpex, pagination, toggleSearchBar, addTemplate,
}) => (
    <div>
        <CustomHeader title="Templates" subtitle="Templates" icon="template">
            <NewPagination showPagination ops={tempOpex} pagination={pagination} />
            <div className="new-template-wrapper">
                <div className="searchBtn" tabIndex={0} title="Show search bar" onClick={() => toggleSearchBar()} role="button" onKeyPress={toggleSearchBar}>
                    <i className="fa fa-search" />
                </div>
                <div onClick={() => addTemplate()} tabIndex={0} className="new-btn-flat red" role="button" title="Create a new template" onKeyPress={addTemplate}>
                        New Template
                    <i className="fa fa-plus" />
                </div>
            </div>
        </CustomHeader>
    </div>
);

TemplateHeader.propTypes = {
    tempOpex: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    pagination: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    toggleSearchBar: PropTypes.func.isRequired,
    addTemplate: PropTypes.func.isRequired,
};


export default TemplateHeader;
