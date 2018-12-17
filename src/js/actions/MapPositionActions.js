/* eslint-disable */
import deviceManager from '../comms/devices/DeviceManager';
import toaster from '../comms/util/materialize';

const alt = require('../alt');

class MapPositionActions {
    fetchDevices(params = null, cb) {
        return (dispatch) => {
            dispatch();
            deviceManager
                .getDevices(params)
                .then((result) => {
                    console.log("Received devices");
                    this.updateDevices(result);
                    if (cb) {
                        cb(result);
                    }
                })
                .catch((error) => {
                    this.devicesFailed(error);
                });
        };
    }
    
    fetchDevicesByTemplate(templateId, params = null, cb) {
        return (dispatch) => {
            dispatch();

            deviceManager
                .getDeviceByTemplateId(templateId, params)
                .then((result) => {
                    this.updateDevices(result);
                    if (cb) {
                        cb(result);
                    }
                })
                .catch((error) => {
                    this.devicesFailed(error);
                });
        };
    }

    updateDevices(list) {
        return list;
    }

    devicesFailed(error) {
        toaster.error(error.message);
        return error;
    }

}

alt.createActions(MapPositionActions, exports);
