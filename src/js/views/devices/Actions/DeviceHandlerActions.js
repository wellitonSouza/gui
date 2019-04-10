import deviceManager from 'Comms/devices';
import toaster from 'Comms/util/materialize';

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
        const newDevice = this.diffBetweenTemplateAndSpecializedAttrsAndMetas(selectedTemplates, device);
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
     *
     * @param templates Array of templates that be associated with device
     * @param device Object with all data of device
     * @returns {*} new object with  all data of device  without not specialized  attr and metas.
     */
    diffBetweenTemplateAndSpecializedAttrsAndMetas(templates, device) {
        let specializedAttrs = [];
        const modifiedDevice = device;

        templates.forEach((template) => {
            template.attrs.forEach((attrTemp) => {
                let specializedMetas = [];
                let shouldNotSpecializeStaticAttrValue = false;
                const filteredAttr = modifiedDevice.attrs.filter((attrDev) => {
                    if (attrDev.id === attrTemp.id
                        && attrDev.label === attrTemp.label
                        && attrDev.template_id === attrTemp.template_id
                        && attrDev.value_type === attrTemp.value_type
                        && attrDev.type === attrTemp.type) {
                        if (attrDev.static_value === attrTemp.static_value && attrDev.type === 'static') {
                            shouldNotSpecializeStaticAttrValue = true;
                        }

                        if (attrTemp.metadata) {
                            specializedMetas = attrDev.metadata.filter((meta) => {
                                let shouldNotSpecializeStaticMetaValue = false;
                                attrTemp.metadata.forEach((metaDev) => {
                                    if (metaDev.id === meta.id
                                        && metaDev.label === meta.label
                                        && metaDev.value_type === meta.value_type
                                        && metaDev.type === meta.type) {
                                        if (metaDev.static_value !== meta.static_value) {
                                            shouldNotSpecializeStaticMetaValue = true;
                                        }
                                    }
                                });
                                return shouldNotSpecializeStaticMetaValue;
                            });
                        }
                        return specializedMetas.length > 0 || (attrDev.static_value !== attrTemp.static_value && attrDev.type === 'static');
                    }
                    return false;
                });
                if (filteredAttr && filteredAttr[0]) {
                    filteredAttr[0].metadata = specializedMetas;
                    if (shouldNotSpecializeStaticAttrValue) {
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
        console.log('triggerUpdate', device);
        return (dispatch) => {
            dispatch();
            deviceManager
                .setDevice(device)
                .then(() => {
                    this.updateSingle(device);
                    if (cb) {
                        cb(device);
                    }
                })
                .catch((error) => {
                    this.devicesFailed(error);
                });
        };
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
