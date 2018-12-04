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
}

export default DeviceHandlerActions;
