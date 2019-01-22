import React from 'react';
import PropTypes, { func } from 'prop-types';

const HeadImportExport = (props) => {
    const {
        main, icon, handleClick, title, firstMessage,
    } = props;
    if (!main) {
        return (
            <div
                onClick={() => handleClick()}
                className="over head-sub"
                role="button"
                tabIndex={0}
                onKeyPress={handleClick}
            >
                <div className="head-icon">
                    <img src={`images/icons/${icon}.png`} alt="images/alarm/warning.png" />
                </div>
                <div className="head-text">
                    <div className="title">{title}</div>
                    <div className="subtitle">{firstMessage}</div>
                </div>
            </div>
        );
    }
    return (
        <div className="head">
            <div className="head-icon">
                <img src={`images/icons/${icon}.png`} alt="images/alarm/warning.png" />
            </div>
            <div className="head-text">
                <div className="title">{title}</div>
                <div className="subtitle">{firstMessage}</div>
            </div>
        </div>
    );
};
HeadImportExport.defaultProps = {
    main: false,
    handleClick: func,
};

HeadImportExport.propTypes = {
    main: PropTypes.bool,
    icon: PropTypes.string.isRequired,
    handleClick: PropTypes.func,
    title: PropTypes.string.isRequired,
    firstMessage: PropTypes.string.isRequired,
};

export default HeadImportExport;
