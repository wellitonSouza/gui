import React from 'react';
import PropTypes from 'prop-types';
import MaterialInput from 'Components/MaterialInput';
import MaterialSelect from 'Components/MaterialSelect';
import { attrsType } from '../../../TemplatePropTypes';

const SidebarAttributeForm = ({
    selectAttr,
    changeAttrValue,
}) => (
    <div>
        <div className="body-attribute-name">
            <div className="body-icon">
                <img
                    className="title-icon attribute"
                    src="images/icons/data_attrs-gray.png"
                    alt=""
                />
            </div>
            <MaterialInput
                name="label"
                className="attribute-type"
                maxLength={40}
                value={selectAttr.label}
                onChange={e => changeAttrValue(e, selectAttr)}
            >
                Attribute Name
            </MaterialInput>
        </div>
        <div className="body-form">
            <MaterialSelect
                label="Attribute Type"
                name="type"
                className="attribute-type"
                value={selectAttr.type}
                onChange={e => changeAttrValue(e, selectAttr)}
            >
                <option value="" disabled>
                    Select type
                </option>
                <option value="dynamic" id="adm-option">
                    Dynamic Value
                </option>
                <option value="static" id="adm-option">
                    Static Value
                </option>
                <option value="actuator" id="adm-option">
                    Actuator
                </option>
            </MaterialSelect>
            <MaterialSelect
                id="value_types"
                label="Value Type"
                name="value_type"
                className="value-type"
                value={selectAttr.value_type}
                onChange={e => changeAttrValue(e, selectAttr)}
            >
                <option value="" disabled>
                    Select type
                </option>
                <option value="bool" id="adm-option">
                    Boolean
                </option>
                <option value="geo:point" id="adm-option">
                    Geo
                </option>
                <option value="float" id="adm-option">
                    Float
                </option>
                <option value="integer" id="adm-option">
                    Integer
                </option>
                <option value="string" id="adm-option">
                    String
                </option>
            </MaterialSelect>

            {
                selectAttr.type !== 'dynamic'
                    ? (
                        <MaterialInput
                            name="static_value"
                            className="attribute-value"
                            maxLength={40}
                            value={selectAttr.static_value}
                            onChange={e => changeAttrValue(e, selectAttr)}
                        >
                            Value
                        </MaterialInput>
                    )
                    : null
            }
        </div>
    </div>
);

SidebarAttributeForm.propTypes = {
    selectAttr: PropTypes.shape(attrsType).isRequired,
    changeAttrValue: PropTypes.func.isRequired,
};

export default SidebarAttributeForm;
