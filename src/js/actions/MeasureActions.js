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

  fetchPosition(device, device_id, templates, attrName, history_length) {
    function getUrl() {
      if (history_length === undefined) { history_length = 1; }
      let url = '/history/STH/v1/contextEntities/type/template_' + templates + '/id/' + device_id + '/attributes/' + attrName + '?lastN=' + history_length;

      return url;
    }

    function parserPosition(position){
      let parsedPosition = position.split(", ");
      if(parsedPosition.length > 1){
        return [parseFloat(parsedPosition[0]), parseFloat(parsedPosition[1])];
      }
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
          let position = null;
          let values = reply.contextResponses[0].contextElement.attributes[0].values;
          for(let k in values){
            if(values[k].attrValue !== null){
              position = parserPosition(values[k].attrValue);
            }
          }

          device.position = position;
          const data = device;
          this.updateMeasures(data);

        })
        .catch((error) => {console.error("failed to fetch data", error);});
    }
  }

  updateMeasuresAttr(device, attr, data) {
    return {device: device, attr: attr, data: data};
  }

  measuresFailed(error) {
    return error;
  }


}

alt.createActions(MeasureActions, exports);
