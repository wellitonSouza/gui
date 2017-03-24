import deviceManager from '../comms/devices/DeviceManager';

var alt = require('../alt');

class DeviceActions {

  fetchDevices() {
    return (dispatch) => {
      dispatch();

      deviceManager.getDevices().then((devicesList) => {
        this.updateDevices(devicesList.devices);
      })
      .catch((error) => {
        this.devicesFailed(error);
      });
    }
  }

  updateDevices(list) {
    return list;
  }

  addDevice(device) {
    const newDevice = device;
    return (dispatch) => {
      dispatch();
      deviceManager.addDevice(newDevice)
        .then((response) => {
          this.insertDevice(newDevice);
        })
        .catch((error) => {
          this.devicesFailed("Failed to add device to list");
        })
    }
  }

  insertDevice(devices) {
    return devices;
  }

  triggerUpdate(device) {
    return (dispatch) => {
      dispatch();

      deviceManager.setDevice(device)
        .then((response) => {
          this.updateSingle(device);
        })
        .catch((error) => {
          this.devicesFailed("Failed to update given device");
        })
    }
  }

  updateSingle(devices) {
    return devices;
  }

  triggerRemoval(device) {
    return (dispatch) => {
      dispatch();
      deviceManager.deleteDevice(device.id)
        .then((response) => {
          this.removeSingle(device.id);
        })
        .catch((error) => {
          this.devicesFailed("Failed to remove given device");
        })
    }
  }

  removeSingle(devices) {
    return devices;
  }

  devicesFailed(error) {
    return error;
  }
}

alt.createActions(DeviceActions, exports);
