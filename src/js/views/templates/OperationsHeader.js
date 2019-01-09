import React from 'react';
import PropTypes from 'prop-types';
import { DojotBtnLink } from 'Components/DojotButton';
import TemplateActions from 'Actions/TemplateActions';
import Can from '../../components/permissions/Can';

const OperationsHeader = ({ toggleSearchBar }) => (
    <div className="col s5 pull-right pt10">
        <div
            className="searchBtn"
            title="Show search bar"
            onClick={toggleSearchBar}
            onKeyPress={toggleSearchBar}
            role="button"
            tabIndex="0"
        >
            <i className="fa fa-search" />
        </div>
        <Can do="modifier" on="template">
            <DojotBtnLink
                responsive="true"
                onClick={() => TemplateActions.selectTemplate()}
                label="New Template"
                alt="Create a new template"
                icon="fa fa-plus"
                className="w130px"
            />
        </Can>
    </div>
);

OperationsHeader.propTypes = {
    toggleSearchBar: PropTypes.func.isRequired,
};

export default OperationsHeader;
