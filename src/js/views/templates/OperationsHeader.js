import React from 'react';
import PropTypes from 'prop-types';
import { DojotBtnLink } from 'Components/DojotButton';
import TemplateActions from 'Actions/TemplateActions';


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
        <DojotBtnLink
            responsive="true"
            onClick={() => TemplateActions.selectTemplate()}
            label="New Template"
            alt="Create a new template"
            icon="fa fa-plus"
            className="w130px"
        />
    </div>
);

OperationsHeader.propTypes = {
    toggleSearchBar: PropTypes.func.isRequired,
};

export default OperationsHeader;
