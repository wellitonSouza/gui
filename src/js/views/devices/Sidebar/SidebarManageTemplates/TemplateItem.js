import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const TemplateItem = ({ template, checked }) => (
    <Fragment>
        <div className="template-item">
            <div className="template-labels">
                <div className="template-name"> {template.label} </div>
                <div className="total-attrs"> {`${template.attrs.length} attributes`}</div>
            </div>
            <div className="select-template">
                {
                    checked
                        ? <i className="fa fa-check" />
                        : <div className="unchecked" />
                }
            </div>
        </div>
    </Fragment>
);

TemplateItem.defaultProps = {
    checked: false,
};

TemplateItem.propTypes = {
    template: PropTypes.shape({
        label: PropTypes.string,
        attrs: PropTypes.array,
    }).isRequired,
    checked: PropTypes.bool,
};

export default TemplateItem;
