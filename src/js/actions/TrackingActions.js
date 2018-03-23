import alt from  "../alt";
import util from '../comms/util';
import LoginStore from '../stores/LoginStore';

class TrackingActions {
  fetch(device_id, attrName, history_length) {
    function getUrl() {
      if (history_length === undefined) { history_length = 50;}
      let url = '/history/device/' + device_id + '/history?lastN=' + history_length + '&attr=' + attrName;
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
          let history = {device_id: device_id, data:[]};
          for(let k in reply){
            let data = {device_id:device_id};
            if(reply[k].value !== null && reply[k].value !== undefined){
              data.position = parserPosition(reply[k].value);
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
