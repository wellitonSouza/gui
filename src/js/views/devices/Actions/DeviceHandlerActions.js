import deviceManager from 'Comms/devices';

class DeviceHandlerActions {
    set(args) { return args; }

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

    updateSingle(device) {
        return device;
    }
}

export default DeviceHandlerActions;
