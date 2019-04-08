import React from 'react';
import PropTypes from 'prop-types';

const SidebarButton = ({
    onClick, icon, title, disable,
}) => (
    <div
        className={`sidebar-button${disable ? '-disable' : ''}`}
        onClick={disable ? () => {} : onClick}
        onKeyPress={disable ? () => {} : onClick}
        role="button"
        tabIndex="0"
        title={title}
    >
        <div className="button-icon">
            <img
                className="icon"
                src={`images/icons/${icon}-gray.png`}
                alt="icon"
            />
            <div className="button-title">{title}</div>
        </div>
        <div className="arrow-icon">
            <i className="fa fa-angle-right" />
        </div>
    </div>
);

SidebarButton.defaultProps = {
    disable: false,
};

SidebarButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    disable: PropTypes.bool,
};

export default SidebarButton;
