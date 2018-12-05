import React from 'react';
import PropTypes from 'prop-types';

const SidebarButton = ({ onClick, icon, text }) => (
    <div
        className="body-actions--button"
        onClick={onClick}
        onKeyPress={onClick}
        group="button"
        tabIndex="0"
    >
        <div className="button-icon">
            <img
                className="icon"
                src={`images/icons/${icon}-gray.png`}
                alt="icon"
            />
            <div className="text-label">
                {text}
            </div>
        </div>
        <div className="arrow-icon">
            <i className="fa fa-angle-right" />
        </div>
    </div>
);

SidebarButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

export default SidebarButton;
