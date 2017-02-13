var alt = require('../alt');
var DeviceActions = require('../actions/DeviceActions');

class DeviceStore {
  constructor() {
    this.devices = [];
    this.error = null;

    this.bindListeners({
      handleUpdateDeviceList: DeviceActions.UPDATE_DEVICES,
      handleInsertDevice: DeviceActions.INSERT_DEVICE,
      handleAddDevice: DeviceActions.ADD_DEVICE,
      handleFetchDeviceList: DeviceActions.FETCH_DEVICES,

      handleTriggerUpdate: DeviceActions.TRIGGER_UPDATE,
      handleUpdateSingle: DeviceActions.UPDATE_SINGLE,

      handleTriggerRemoval: DeviceActions.TRIGGER_REMOVAL,
      handleRemoveSingle: DeviceActions.REMOVE_SINGLE,

      handleFailure: DeviceActions.DEVICES_FAILED,
    });
  }

  handleUpdateDeviceList(devices) {
    this.devices = devices;
    this.error = null;
  }

  handleUpdateSingle(device) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].id == device.id) {
        let newDevice = JSON.parse(JSON.stringify(device))
        this.devices[i] = newDevice;
      }
    }
  }

  handleTriggerUpdate(device) {
    // trigger handler for updateSingle
    this.error = null;
  }

  handleTriggerRemoval(device) {
    // trigger handler for updateSingle
    this.error = null;
  }

  handleRemoveSingle(id) {
    this.devices = this.devices.filter(function(e) {
      return e.id != id;
    })
  }

  handleInsertDevice(device) {
    this.devices.push(device);
    this.error = null;
  }

  handleAddDevice(newDevice) {
    // this is actually just a intermediary while addition happens asynchonously
    this.error = null;
  }

  handleFetchDeviceList() {
    this.devices = [];
  }

  handleFailure(error) {
    this.error = error;
  }
}

var _store =  alt.createStore(DeviceStore, 'DeviceStore');
export default _store;
