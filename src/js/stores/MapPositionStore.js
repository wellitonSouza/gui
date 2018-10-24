/* eslint-disable */
const alt = require('../alt');
const MapPositionActions = require('../actions/MapPositionActions');

class MapPositionStore {
  constructor() {
    this.devicesPos = [];
    this.allDevices = [];

    this.error = null;
    this.loading = false;

    this.bindListeners({
      handleUpdateDeviceList: MapPositionActions.UPDATE_DEVICES,
      handleFetchDeviceList: MapPositionActions.FETCH_DEVICES,
      handleFetchDevicesByTemplate:
        MapPositionActions.FETCH_DEVICES_BY_TEMPLATE,

      handleFailure: MapPositionActions.DEVICES_FAILED
    });
  }

//   const newDevice = JSON.parse(JSON.stringify(device));
//   handleUpdateSingle(device) {

  handleUpdateDeviceList(res) {
    console.log('receiving raw device list: ', res);
    const devices = res.devices;
    this.devicesPos = [];
    this.allDevices = [];

    for (let deviceID in devices) {
      let dev = {};
      dev.label = devices[deviceID].label;
      dev.id = devices[deviceID].id;
      dev.unique_key = devices[deviceID].unique_key;
      dev.timestamp = devices[deviceID].timestamp;
      dev.has_dynamic_position = false;
      dev.has_static_position = false;

      for (let templateID in devices[deviceID].attrs) {
        for (let attrID in devices[deviceID].attrs[templateID]) {
          if (devices[deviceID].attrs[templateID][attrID].type === "dynamic") {
            if (devices[deviceID].attrs[templateID][attrID].value_type === "geo:point") {
              dev.has_dynamic_position = true;
              dev.active_tracking = false;
              dev.dy_positions = [];
              dev.dp_metadata = { id: devices[deviceID].id, attr_label: devices[deviceID].attrs[templateID][attrID].label };
            }
          }

          if (devices[deviceID].attrs[templateID][attrID].type === "static") {
            if (devices[deviceID].attrs[templateID][attrID].value_type === "geo:point") {
              dev.has_static_position = true;
              const aux = devices[deviceID].attrs[templateID][attrID].static_value; 
              const parsedPosition = aux.split(',');
              dev.sp_value = [parseFloat(parsedPosition[0]), parseFloat(parsedPosition[1])];
            }
          }
        }
      }
      this.allDevices.push(dev);
      if (dev.has_dynamic_position || dev.has_static_position)
      {
        this.devicesPos.push(dev);
      }
    }


    console.log("devicesPos", this.devicesPos);
    this.error = null;
    this.loading = false;

  }


  handleFetchDeviceList() {
    this.devicesPos = [];
    this.allDevices = [];
    this.loading = true;
  }

  handleFetchDevicesByTemplate() {
    this.devicesPos = [];
    this.allDevices = [];
    this.loading = true;
  }

  handleFailure(error) {
    this.error = error;
    this.loading = false;
  }
}

const _store = alt.createStore(MapPositionStore, 'MapPositionStore');
export default _store;
