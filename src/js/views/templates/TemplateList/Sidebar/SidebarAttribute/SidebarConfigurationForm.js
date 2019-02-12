import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MaterialInput from 'Components/MaterialInput';
import MaterialSelect from 'Components/MaterialSelect';
import ability from 'Components/permissions/ability';
import { withNamespaces } from 'react-i18next';
import { attrsType } from '../../../TemplatePropTypes';


const SidebarConfigurationForm = ({
    selectAttr,
    changeAttrValue,
    t,
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
                label={t('options.config_type.label')}
                name="label"
                className="config-type"
                value={selectAttr.label}
                onChange={e => changeAttrValue(e, selectAttr)}
                isDisable={!ability.can('modifier', 'template')}
            >
                <option value="" disabled>
                    {t('text.select_type')}
                </option>
                <option value="protocol" id="adm-option">
                    {t('options.config_type.values.protocol')}
                </option>
                <option value="topic" id="adm-option">
                    {t('options.config_type.values.topic')}
                </option>
                <option value="translator" id="adm-option">
                    {t('options.config_type.values.translator')}
                </option>
                <option value="device_timeout" id="adm-option">
                    {t('options.config_type.values.device_timeout')}
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
                {t('value.label')}
            </MaterialInput>
        </div>
    </Fragment>
);

SidebarConfigurationForm.propTypes = {
    selectAttr: PropTypes.shape(attrsType).isRequired,
    changeAttrValue: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
};

export default withNamespaces()(SidebarConfigurationForm);
