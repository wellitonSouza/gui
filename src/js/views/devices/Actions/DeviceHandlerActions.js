import deviceManager from 'Comms/devices';
import templateManager from 'Comms/templates';
import toaster from 'Comms/util/materialize';

async function getTemplatesByDevice(device) {
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

class DeviceHandlerActions {
    set(args) {
        if (args) {
            this.fetchTemplateData(args.templates);
        }
        return args;
    }

    fetchTemplateData(templateList, cb) {
        return (dispatch) => {
            dispatch();
            deviceManager
                .getTemplateGQL(templateList)
                .then((result) => {
                    // console.log('fetchTemplateData', result);
                    this.setTemplateData(result.data);
                    if (cb) {
                        cb(result);
                    }
                })
                .catch((error) => {
                    this.devicesFailed(error);
                });
        };
    }

    setTemplateData(data) {
        return data;
    }

    update(args) {
        return args;
    }

    fetch(id) {
        return (dispatch) => {
            dispatch();
            deviceManager
                .getDevice(id)
                .then((d) => {
                    this.set(d);
                })
                .catch((error) => {
                    this.devicesFailed(error);
                });
        };
    }

    toggleSidebarDevice(value) {
        return value;
    }

    selectTemplate(template) {
        return template;
    }

    addDevice(device, selectedTemplates, cb) {
        const newDevice = this.diffTempAndSpecializedAttrsAndMetas(device, selectedTemplates);
        return (dispatch) => {
            dispatch();
            deviceManager
                .addDevice(newDevice)
                .then((response) => {
                    this.insertDevice(response.devices[0]);
                    if (cb) {
                        cb(response.devices[0]);
                    }
                })
                .catch((error) => {
                    this.devicesFailed(error);
                });
        };
    }

    /**
     * Remove all values of attrs and metas that it will be not specialized
     * comparing with templates
     *
     * @param device Object with all data of device
     * @param templates Array of templates that be associated with device
     * @param oldDevice When is a update
     * @returns {*} new object with  all data of device  without not specialized  attr and metas.
     */
    diffTempAndSpecializedAttrsAndMetas(device, templates, oldDevice = null) {
        let specializedAttrs = [];
        const modifiedDevice = device;

        templates.forEach((template) => {
            template.attrs.forEach((attrTemp) => {
                let specializedMetas = [];
                let notSpecializeStaticAttrValue = false;
                const filteredAttr = modifiedDevice.attrs.filter((attrDev) => {
                    if (attrDev.id === attrTemp.id
                        /*                        && attrDev.label === attrTemp.label
                            && attrDev.template_id === attrTemp.template_id
                            && attrDev.value_type === attrTemp.value_type */
                        && attrDev.type === attrTemp.type) {
                        const oldFilteredAttr = oldDevice ? oldDevice[template.id].attrs.filter(oldAttrDev => attrDev.id === oldAttrDev.id) : null;

                        if (attrDev.static_value === attrTemp.static_value && attrDev.type !== 'dynamic') {
                            // if template update the static value for
                            // the same of device, do not.. keep old value
                            if (oldFilteredAttr) {
                                notSpecializeStaticAttrValue = oldFilteredAttr[0].static_value !== attrDev.static_value;
                            } else {
                                notSpecializeStaticAttrValue = true;
                            }
                        }

                        if (attrTemp.metadata) {
                            specializedMetas = attrDev.metadata.filter((metaDev) => {
                                let specializeStaticMetaValue = false;
                                attrTemp.metadata.forEach((metaTemp) => {
                                    if (metaTemp.id === metaDev.id
                                    /*                                       && metaDev.label === meta.label
                                        && metaDev.value_type === meta.value_type
                                        && metaDev.type === meta.type */
                                    ) {
                                        const oldFilteredMeta = oldFilteredAttr ? oldFilteredAttr[0].metadata.filter(oldAttrDev => metaDev.id === oldAttrDev.id) : null;
                                        if (metaTemp.static_value !== metaDev.static_value) {
                                            specializeStaticMetaValue = true;
                                        } else if (oldFilteredMeta && oldFilteredMeta[0].static_value === metaDev.static_value) {
                                            specializeStaticMetaValue = true;
                                        }
                                    }
                                });
                                return specializeStaticMetaValue;
                            });
                        }
                        return specializedMetas.length > 0 || (attrDev.static_value !== attrTemp.static_value && attrDev.type !== 'dynamic');
                    }
                    return false;
                });
                if (filteredAttr && filteredAttr[0]) {
                    filteredAttr[0].metadata = specializedMetas;
                    if (notSpecializeStaticAttrValue) {
                        delete filteredAttr[0].static_value;
                    }
                }
                specializedAttrs = specializedAttrs.concat(filteredAttr);
            });
        });

        modifiedDevice.attrs = specializedAttrs;
        return modifiedDevice;
    }

    triggerUpdate(device, cb) {
        // const newDevice = this.diffTempAndSpecializedAttrsAndMetas(selectedTemplates, device);
        /*        const newDevice = device; */
        return (async (dispatch) => {
            dispatch();
            const templates = await getTemplatesByDevice(device);
            const oldDevice = await deviceManager.getDevice(device.id);
            console.log('triggerUpdate device oldDevice templates', device, oldDevice, templates);
            const newDevice = this.diffTempAndSpecializedAttrsAndMetas(device, templates, oldDevice);
            deviceManager
                .setDevice(newDevice)
                .then(() => {
                    this.updateSingle(newDevice);
                    if (cb) {
                        cb(newDevice);
                    }
                })
                .catch((error) => {
                    this.devicesFailed(error);
                });
        });
    }

    triggerRemoval(device, cb) {
        return (dispatch) => {
            dispatch();
            deviceManager
                .deleteDevice(device.id)
                .then((response) => {
                    this.removeSingle(device.id);
                    if (cb) {
                        cb(response);
                    }
                })
                .catch((error) => {
                    this.devicesFailed('Failed to remove given device');
                });
        };
    }

    updateSingle(device) {
        return device;
    }

    insertDevice(devices) {
        return devices;
    }

    removeSingle(id) {
        return id;
    }

    devicesFailed(error) {
        toaster.error(error.message);
        return error;
    }
}

export default DeviceHandlerActions;
