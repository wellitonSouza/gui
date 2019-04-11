import templateManager from 'Comms/templates';

class DeviceHandlerHelper {
    async getTemplatesByDevice(device) {
        const templates = [];
        const promises = [];
        device.templates.forEach((idTemplate) => {
            promises.push(templateManager.getTemplate(idTemplate)
                .then((template) => {
                    templates.push(template);
                }));
        });
        await Promise.all(promises);
        return templates;
    }

    /**
     * Remove all values of attrs and metas that it will be not specialized
     * comparing with templates
     *
     * @param device Object with all data of device
     * @param templates Array of templates that be associated with device
     * @param oldDevice When is a update, this is use to keep the specialized
     *                                  when the old value is equals to template
     * @returns {*} new object with  all data of device  without not specialized  attr and metas.
     */
    diffTemAndSpecializedAttrsMetas(device, templates, oldDevice = null) {
        let specializedAttrs = [];
        const modifiedDevice = device;

        templates.forEach((template) => {
            if (template.attrs) {
                template.attrs.forEach((attrTemp) => {
                    let specializedMetas = [];
                    let notSpecializeStaticAttr = false;
                    let filteredAttr = [];

                    if (modifiedDevice.attrs) {
                        filteredAttr = modifiedDevice.attrs.filter((attrDev) => {
                            if (attrDev.id === attrTemp.id
                                && attrDev.template_id === attrTemp.template_id
                            ) {
                                const oldAttr = this._filterAttrFromOldDevice(oldDevice, template, attrDev);
                                notSpecializeStaticAttr = this._isNotSpecializeStaticAttr(attrDev, attrTemp, oldAttr);
                                specializedMetas = this._filterSpecializedMetas(attrTemp, attrDev, oldAttr);

                                return specializedMetas.length > 0 || (attrDev.static_value !== attrTemp.static_value && attrDev.type !== 'dynamic');
                            }
                            return false;
                        });
                    }
                    const attrElement = filteredAttr[0];
                    if (filteredAttr && attrElement) {
                        attrElement.metadata = specializedMetas;
                        if (notSpecializeStaticAttr) {
                            delete attrElement.static_value;
                        }
                    }
                    specializedAttrs = specializedAttrs.concat(filteredAttr);
                });
            }
        });

        modifiedDevice.attrs = specializedAttrs;
        return modifiedDevice;
    }

    _filterAttrFromOldDevice(oldDevice, template, attrDev) {
        let oldFilteredAttr = null;
        if (oldDevice && oldDevice.attrs && oldDevice.attrs[template.id]) {
            oldFilteredAttr = oldDevice.attrs[template.id].filter(oldAttrDev => attrDev.id === oldAttrDev.id);
        }
        return oldFilteredAttr && oldFilteredAttr[0] ? oldFilteredAttr[0] : null;
    }

    _isNotSpecializeStaticAttr(attrDev, attrTemp, oldAttr) {
        let notSpecializeStaticAttr = false;
        if (attrDev.static_value === attrTemp.static_value && attrDev.type !== 'dynamic') {
            if (oldAttr) {
                notSpecializeStaticAttr = oldAttr.static_value !== attrDev.static_value;
            } else {
                notSpecializeStaticAttr = true;
            }
        }
        return notSpecializeStaticAttr;
    }

    _filterSpecializedMetas(attrTemp, attrDev, oldAttr) {
        console.log('_filterSpecializedMetas attrTemp, attrDev, oldAttr', attrTemp, attrDev, oldAttr);
        let specializedMetas = [];
        if (attrTemp.metadata && attrDev.metadata) {
            specializedMetas = attrDev.metadata.filter((metaDev) => {
                let specializeStaticMetaValue = false;
                attrTemp.metadata.forEach((metaTemp) => {
                    if (metaTemp.id === metaDev.id) {
                        const oldFilteredMeta = oldAttr && oldAttr.metadata
                            ? oldAttr.metadata.filter(oldMetaDev => metaDev.id === oldMetaDev.id) : null;
                        if (metaTemp.static_value === metaDev.static_value) {
                            specializeStaticMetaValue = oldFilteredMeta
                                && oldFilteredMeta[0].static_value
                                !== metaDev.static_value;
                        } else {
                            specializeStaticMetaValue = true;
                        }
                    }
                });
                return specializeStaticMetaValue;
            });
        }

        console.log('_filterSpecializedMetas specializedMetas', specializedMetas);
        return specializedMetas;
    }
}

const deviceHandlerHelper = new DeviceHandlerHelper();
export default deviceHandlerHelper;
