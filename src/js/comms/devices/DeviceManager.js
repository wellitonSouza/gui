import util from '../util';

class DeviceManager {
  constructor() {
    this.baseUrl = "";
  }

  getDevices(params) {
    if (params) {
      let qs = Object.keys(params)
        .map(key => key + "=" + params[key])
        .join("&");
      return util.GET(this.baseUrl + "/device?" + qs);
    } else return util.GET(this.baseUrl + "/device?page_size=1000");
  }

  // @TODO probably here isn't a good place to handle stats
  getStats() {
    return util.GET(this.baseUrl + "/metric/admin/metrics/");
  }

  getLastDevices(field) {
    return util.GET(this.baseUrl + "/device?limit=10&sortDsc=" + field);
  }

  getDevice(id) {
    return util.GET(this.baseUrl + "/device/" + id);
  }

  getDeviceByTemplateId(templateId, params) {
    if (params) {
      let qs = Object.keys(params)
        .map(key => key + "=" + params[key])
        .join("&");
      return util.GET(this.baseUrl + "/device/template/" + templateId + "?" + qs);
    }
    else
      return util.GET(this.baseUrl + "/device/template/" + templateId);
  }

  setDevice(detail) {
    return util.PUT(this.baseUrl + "/device/" + detail.id, detail);
  }

  addDevice(d) {
    d.id = util.sid();
    return util.POST(this.baseUrl + "/device", d);
  }

  deleteDevice(id) {
    return util.DELETE(this.baseUrl + "/device/" + id);
  }
}

var deviceManager = new DeviceManager();
export default deviceManager;
