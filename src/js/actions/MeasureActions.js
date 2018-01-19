import measureManager from '../comms/measures/MeasureManager';
import LoginStore from '../stores/LoginStore';

var alt = require('../alt');
import util from '../comms/util';

class MeasureActions {

  appendMeasures(data) { return data; }
  updateMeasures(data) {
    return data;
  }

  fetchMeasure(device, device_id, templates, attrs, history_length, callback) {

    console.log("MeasureActions, fetchMeasure", device_id, attrs, history_length, callback);
    function getUrl() {
      if (history_length === undefined) { history_length = 1; }
      let url = '/history/STH/v1/contextEntities/type/template_' + templates + '/id/' + device_id + '/attributes/' + attrs + '?lastN=' + history_length;
      return url;
    }

    return (dispatch) => {
      dispatch();

      const service = LoginStore.getState().user.service;
      const config = {
        method: 'get',
        headers: new Headers({
          'fiware-service': service,
          'fiware-servicepath': '/'
        })
      }
      util._runFetch(getUrl(), config)
        .then((reply) => {
          if(reply.contextResponses[0].contextElement.attributes[0].values !== null || reply.contextResponses[0].contextElement.attributes[0].values !== undefined){
            let history = reply.contextResponses[0].contextElement.attributes[0].values;
            let values = [];
            for(let k in history){
              if(history[k].attrValue !== null){
                values[k] = history[k].attrValue;
              }
            }
            device.value = values;
            const data = device;
            this.updateMeasures(data);
          }
          if (callback) {callback(reply)}
        })
        .catch((error) => {console.error("failed to fetch data", error);});
    }
  }

  updatePosition(data) {return data;}

  fetchPosition(device_id, history_length) {
    const attrs = ['lat', 'lng', 'sinr', 'rssi', 'ts', 'device-status'];
    function getUrl() {
      if (history_length === undefined) { history_length = 1; }
      let url = '/history/device/' + device_id + '/history' + '?lastN=' + history_length;
      attrs.map((attr) => {url += '&attr=' + attr});
      return url;
    }

    return (dispatch) => {
      dispatch();
      util._runFetch(getUrl(), {method: 'get'})
        .then((reply) => {
          let data = {device_id: device_id};
          if ((reply.lat.length > 0) && (reply.lng.length > 0)) {
            if (reply.lat[0].value !== "nan" && reply.lng[0].value !== "nan") {
              data.position = [parseFloat(reply.lat[0].value), parseFloat(reply.lng[0].value)];
            }
          }

          if (reply.sinr.length > 0) {
            data.sinr = parseFloat(reply.sinr[0].value)
          }
          if (reply.rssi.length > 0) {
            data.rssi = parseFloat(reply.rssi[0].value)
          }
          if (reply.ts.length > 0) {
            data.ts = reply.ts[0].ts
          }
          if (reply['device-status'].length > 0) {
            data.status = reply['device-status'][0].value
          }

          this.updatePosition(data);
        })
        .catch((error) => {console.error("failed to fetch data", error);});
    }
  }

  //fetchMeasures(device, device_id, attrName){
  //  function getUrl() {
  //    return '/metric/v2/entities/' + device_id + '/attrs/' + attrName;
  //  }

  //  return (dispatch) => {
  //    dispatch({device: device, attr: attrName});

  //    const service = LoginStore.getState().user.service;
  //    const config = {
  //      method: 'get',
  //      headers: new Headers({
  //        'fiware-service': service,
  //        'fiware-servicepath': '/'
  //      })
  //    }
  //    util._runFetch(getUrl(), config)
  //      .then((reply) => {
  //        if(reply.value !== null){
  //          device.position = reply.value.split(",");
  //          const data = device;
  //          this.updateMeasures(data);
  //        }
  //      })
  //      .catch((error) => {console.error("failed to fetch data", error);});
  //  }
  //}


  updateMeasuresAttr(device, attr, data) {
    return {device: device, attr: attr, data: data};
  }

  measuresFailed(error) {
    return error;
  }


}

alt.createActions(MeasureActions, exports);
