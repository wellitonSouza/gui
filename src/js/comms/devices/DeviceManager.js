import util from '../util';

class DeviceManager {
  constructor() {
    this.baseUrl = ""
  }

  getDevices() {
    return util.GET(this.baseUrl + '/device');
  }

  getDevice(id) {
    return util.GET(this.baseUrl + "/device/" + id);
  }

  setDevice(detail) {
    return util.PUT(this.baseUrl + "/device/" + detail.id, detail);
  }

  addDevice(d) {
    d.id = util.guid();
    return util.POST(this.baseUrl + "/device", d);
  }

  deleteDevice(id) {
    return util.DELETE(this.baseUrl + "/device/" + id);
  }
}

var deviceManager = new DeviceManager();
export default deviceManager;
