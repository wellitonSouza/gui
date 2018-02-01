import alt from  "../alt";
import util from '../comms/util';
import LoginStore from '../stores/LoginStore';

class TrackingActions {
  fetch(device_id, templates, attrName, history_length) {
    function getUrl() {
      if (history_length === undefined) { history_length = 500;}
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
          let history = {device_id: device_id, data: []};
          let values = reply.contextResponses[0].contextElement.attributes[0].values;
          for(let k in values){
            let data = {device_id: device_id};
            if(values[k].attrValue !== null && values[k].attrValue !== undefined){
                data.position = parserPosition(values[k].attrValue);
            }
            history.data.push(data);
          }
          this.set(history);

        })
        .catch((error) => {console.error("failed to fetch data", error);});
    }
  }

  set(history){ return history; }
  dismiss(device_id){ return device_id; }
}
alt.createActions(TrackingActions, exports);
