import React from 'react';
import PropTypes from 'prop-types';

const SidebarButton = ({
    onClick, icon, title, subtitle,
}) => (
    <div
        className="sidebar-button"
        onClick={onClick}
        onKeyPress={onClick}
        role="button"
        tabIndex="0"
    >
        <div className="button-icon">
            <img
                className="icon"
                src={`images/icons/${icon}-gray.png`}
                alt="icon"
            />
            <div className="labels">
                <div className="button-title">{title}</div>
                {
                    subtitle.length > 0 && (<div className="button-subtitle">{subtitle}</div>)
                }
            </div>
        </div>
        <div className="arrow-icon">
            <i className="fa fa-angle-right" />
        </div>
    </div>
);

SidebarButton.defaultProps = {
    subtitle: '',
};

SidebarButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
};

export default SidebarButton;
