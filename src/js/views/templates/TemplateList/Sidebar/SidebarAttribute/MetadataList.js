import React from 'react';
import PropTypes from 'prop-types';
import { attrsType } from '../../../TemplatePropTypes';

const MetadataList = ({ values, selectMetadata }) => {
    if (Object.prototype.hasOwnProperty.call(values, 'metadata')) {
        return (
            <div className="metadata-list-wrapper">
                <div className="metadata-list-title">
                    Metadata
                </div>
                {
                    values.metadata.map(metadata => (
                        <div
                            className="metadata-list-item"
                            key={metadata.id}
                            onClick={() => selectMetadata(metadata)}
                            onKeyPress={() => selectMetadata(metadata)}
                            tabIndex="0"
                            role="button"
                        >
                            <div className="metadata-icon">
                                <img
                                    className="title-icon attribute"
                                    src="images/icons/data_attrs-gray.png"
                                    alt=""
                                />
                            </div>
                            <div className="metadata-label">
                                {metadata.label}
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    }
    return (
        <div className="metadata-list-nodata">
            Select an option below to add a metadata
        </div>
    );
};

MetadataList.propTypes = {
    values: PropTypes.shape(attrsType).isRequired,
};

export default MetadataList;
