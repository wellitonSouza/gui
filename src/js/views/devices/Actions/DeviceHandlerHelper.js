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
     *
     * @returns {*} new object with  all data of device  without not specialized  attr and metas.
     */
    diffTemAndSpecializedAttrsMetas(device, templates) {
        let specializedAttrs = [];
        const modifiedDevice = device;
        templates.forEach((template) => {
            if (template.attrs) {
                template.attrs.forEach((attrTem) => {
                    let specializedMetas = [];
                    let specializedStaticAttr = true;
                    const filteredAttr = modifiedDevice.attrs.filter((attrDev) => {
                        if (attrDev.id === attrTem.id
                            && attrDev.template_id === attrTem.template_id) {
                            specializedStaticAttr = !this._isNotSpecialStaticAttr(attrDev, attrTem);
                            specializedMetas = this._filterSpecializedMetas(attrTem, attrDev);
                            return specializedMetas.length > 0 || (attrDev.static_value !== attrTem.static_value && attrDev.type !== 'dynamic');
                        }
                        return false;
                    });

                    if (filteredAttr[0]) {
                        const attrElement = filteredAttr[0];
                        if (attrElement) {
                            attrElement.metadata = specializedMetas;
                            if (!specializedStaticAttr) {
                                delete attrElement.static_value;
                            }
                        }
                    }

                    specializedAttrs = specializedAttrs.concat(filteredAttr);
                });
            }
        });

        modifiedDevice.attrs = specializedAttrs;
        return modifiedDevice;
    }

    _filterAttrFromOldDevice(oldDev, template, attrDev) {
        let oldAttr = null;
        if (oldDev && oldDev.attrs && oldDev.attrs[template.id]) {
            oldAttr = oldDev.attrs[template.id].filter(oldAttrDev => attrDev.id === oldAttrDev.id);
        }
        return oldAttr && oldAttr[0] ? oldAttr[0] : null;
    }

    _isNotSpecialStaticAttr(attrDev, attrTemp) {
        let notSpecializeStaticAttr = false;
        if (attrDev.static_value === attrTemp.static_value && attrDev.type !== 'dynamic') {
            notSpecializeStaticAttr = true;
        }
        return notSpecializeStaticAttr;
    }

    _filterSpecializedMetas(attrTemp, attrDev) {
        let specializedMetas = [];
        if (attrTemp.metadata && attrDev.metadata) {
            specializedMetas = attrDev.metadata.filter((metaDev) => {
                let specializeStaticMetaValue = false;
                attrTemp.metadata.forEach((metaTemp) => {
                    if (metaTemp.id === metaDev.id) {
                        if (metaTemp.static_value !== metaDev.static_value) {
                            specializeStaticMetaValue = true;
                        }
                    }
                });
                return specializeStaticMetaValue;
            });
        }
        return specializedMetas;
    }
}

const deviceHandlerHelper = new DeviceHandlerHelper();
export default deviceHandlerHelper;
