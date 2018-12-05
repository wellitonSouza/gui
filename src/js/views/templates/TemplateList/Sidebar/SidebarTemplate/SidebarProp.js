import React from 'react';
import PropTypes from 'prop-types';
import { attrsType } from '../../../TemplatePropTypes';

const SidebarProp = ({ attr, icon, toogleSidebarAttribute }) => (
    <div
        className="template-prop"
        onClick={() => toogleSidebarAttribute(icon, attr)}
        onKeyPress={() => toogleSidebarAttribute(icon, attr)}
        group="button"
        tabIndex="0"
    >
        <div className="button-icon">
            <img
                className="icon"
                src={`images/icons/${icon}-gray.png`}
                alt="icon"
            />
            <div className="prop-name">
                <div className="title">{attr.label}</div>
                <div className="subtitle">Name</div>
            </div>
        </div>
        <div className="arrow-icon">
            <i className="fa fa-angle-right" />
        </div>
    </div>
);

SidebarProp.propTypes = {
    attr: PropTypes.shape(attrsType).isRequired,
    icon: PropTypes.string.isRequired,
    toogleSidebarAttribute: PropTypes.func.isRequired,
};

export default SidebarProp;
