import deviceManager from 'Comms/devices';
import toaster from 'Comms/util/materialize';

class DeviceHandlerActions {
    set(args) {
        console.log('DeviceHandlerActions, set:', args);
        this.fetchTemplateData(args.templates);
        return args;
    }


    fetchTemplateData(templateList, cb) {
        return (dispatch) => {
            dispatch();
            deviceManager
                .getTemplateGQL(templateList)
                .then((result) => {
                    console.log('fetchTemplateData', result);
                    this.setTemplateData(result.data);
                    if (cb) {
                        cb(result);
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch template information', error);
                });
        };
    }

    setTemplateData(data) {
        return data;
    }


    update(args) { return args; }

    fetch(id) {
        return (dispatch) => {
            dispatch();
            deviceManager.getDevice(id)
                .then((d) => { this.set(d); })
                .catch((error) => { console.error('Failed to get device', error); });
        };
    }

    toggleSidebarDevice(value) {
        return value;
    }

    selectTemplate(template) {
        return template;
    }

    addDevice(device, cb) {
        const newDevice = device;
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

    triggerUpdate(device, cb) {
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
            deviceManager.deleteDevice(device.id)
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
