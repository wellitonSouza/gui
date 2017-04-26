import measureManager from '../comms/measures/MeasureManager';

var alt = require('../alt');
import util from '../comms/util';

class MeasureActions {

  updateMeasures(device, attr, data) {
    return {device: device, attr: attr, data: data};
  }

  fetchMeasures(device, attr) {
    function getUrl() {
      return '/history/STH/v1/contextEntities/type/device/id/' + device + '/attributes/' + attr + '?lastN=5'
    }

    return (dispatch) => {
      dispatch({device: device, attr: attr});

      const config = {
        method: 'get',
        headers: new Headers({
          'fiware-service': 'devm',
          'fiware-servicepath': '/'
        })
      }
      util._runFetch(getUrl(), config)
        .then((reply) => {
          console.log('got response', reply);
          const data = reply.contextResponses[0].contextElement.attributes[0].values;
          this.updateMeasures(device, attr, data);
        })
        .catch((error) => {console.error("failed to fetch data", error);});
    }
  }

  measuresFailed(error) {
    return error;
  }
}

alt.createActions(MeasureActions, exports);
