import React from 'react';
import MaterialInput from 'Components/MaterialInput';

const AttrCard = () => (
    <div className="attr-card">
        <div className="attr-card-header">
            <img src="images/icons/data_attrs-gray.png" alt="attrs-icon" />
            <div className="attr-card-input-wrapper">
                <MaterialInput
                    className="attr-card-input"
                    name="name"
                    maxLength={40}
                >
                    {'Serial'}
                </MaterialInput>
                <div className="attr-card-type">{'string'}</div>
            </div>
        </div>
        <div className="attr-card-metadata">
            <div className="attr-card-metadata-header">
                <img src="images/icons/metadata-gray.png" alt="attrs-icon" />
                <div className="attr-card-metadata-label">{'Meta attributes(3)'}</div>
                <div className="attr-card-metadata-arrow"></div>
            </div>
        </div>
    </div>
);

export default AttrCard;
