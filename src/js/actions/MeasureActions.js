import measureManager from '../comms/measures/MeasureManager';
import LoginStore from '../stores/LoginStore';

var alt = require('../alt');
import util from '../comms/util';

class MeasureActions {

  updateMeasures(device, attr, data) {
    return {device: device, attr: attr, data: data};
  }

  fetchMeasures(device, type, attr) {

    let devType = 'device';
    if (type == "virtual") {
      devType = "virtual";
    }
    
    function getUrl() {
      return '/history/STH/v1/contextEntities/type/' + devType + '/id/' + device + '/attributes/' + attr.name + '?lastN=10'
    }

    return (dispatch) => {
      dispatch({device: device, attr: attr});

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
