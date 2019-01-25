import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MaterialInput from 'Components/MaterialInput';
import MaterialSelect from 'Components/MaterialSelect';
import ability from 'Components/permissions/ability';
import { attrsType } from '../../../TemplatePropTypes';


const SidebarConfigurationForm = ({
    selectAttr,
    changeAttrValue,
}) => (
    <Fragment>
        <div className="body-config-name">
            <div className="body-config-icon">
                <img
                    className="title-icon attribute"
                    src="images/icons/config_attrs-gray.png"
                    alt=""
                />
            </div>
            <MaterialSelect
                label="Configuration Type"
                name="label"
                className="config-type"
                value={selectAttr.label}
                onChange={e => changeAttrValue(e, selectAttr)}
                isDisable={!ability.can('modifier', 'template')}
            >
                <option value="" disabled>
                    Select type
                </option>
                <option value="protocol" id="adm-option">
                    Protocol
                </option>
                <option value="topic" id="adm-option">
                    Topic
                </option>
                <option value="translator" id="adm-option">
                    Translator
                </option>
                <option value="device_timeout" id="adm-option">
                    Device Timeout
                </option>
            </MaterialSelect>
        </div>
        <div className="body-form">
            <MaterialInput
                name="static_value"
                className="attribute-value"
                maxLength={40}
                value={selectAttr.static_value}
                onChange={e => changeAttrValue(e, selectAttr)}
                disabled={!ability.can('modifier', 'template')}
            >
                Value
            </MaterialInput>
        </div>
    </Fragment>
);

SidebarConfigurationForm.propTypes = {
    selectAttr: PropTypes.shape(attrsType).isRequired,
    changeAttrValue: PropTypes.func.isRequired,
};

export default SidebarConfigurationForm;
