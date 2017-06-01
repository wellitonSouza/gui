var alt = require('../alt');
var DeviceDashboard = require('../actions/DeviceDashboardActions');

class DeviceDashboardStore {
  constructor() {
    this.stats = {};
    this.last_devices = [];
    this.last_templates  = [];
    this.error = null;

    this.bindListeners({
      handleUpdateDeviceList: DeviceDashboard.UPDATE_DEVICES,
      handleFetchDeviceList: DeviceDashboard.FETCH_DEVICES,
      handleUpdateTemplateList: DeviceDashboard.UPDATE_TEMPLATES,
      handleFetchTemplateList: DeviceDashboard.FETCH_TEMPLATES,
      handleUpdateStats: DeviceDashboard.UPDATE_STATS,
      handleFetchStats: DeviceDashboard.FETCH_STATS
     });
  }

  parseStatus(device) {
    if (device.protocol.toLowerCase() == 'virtual') {
      return device.protocol.toLowerCase();
    } else {
      if (device.status) {
        return device.status;
      }
    }

    return "disabled"
  }

  handleUpdateDeviceList(devices) {
    console.log("handleUpdateDeviceList",devices);
    for (let idx = 0; idx < devices.length; idx++) {
      devices[idx]._status = this.parseStatus(devices[idx]);
    }
    this.last_devices = devices;
    this.error = null;
  }

  handleFetchDeviceList() {
    console.log("handleFetchDeviceList");
    this.last_devices = [];
  }

  handleUpdateTemplateList(templates) {
    console.log("handleUpdateTemplateList", templates);
    this.last_templates = templates;
    this.error = null;
  }

  handleFetchTemplateList() {
    console.log("handleFetchTemplateList");
    this.last_templates = [];
  }

  handleUpdateStats(stats) {
    this.stats = stats;
    this.error = null;
  }

  handleFetchStats() {
    this.stats = {};
  }

  handleFailure(error) {
    this.error = error;
  }

}

var _store =  alt.createStore(DeviceDashboardStore, 'DeviceDashboardStore');
export default _store;
