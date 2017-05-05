
var alt = require('../alt');
import util from '../comms/util';

class FlowActions {

  fetch() {
    return (dispatch) => {
      util.GET('flows/v1/flow')
        .then((data) => { this.set(data); })
        .catch((error) => { this.fail(error); })
    }
  }

  set(flows) {
    return flows;
  }

  fetchFlow(flowid) {
    return (dispatch) => {
      dispatch();
      util.GET('flows/v1/flow/' + flowid)
        .then((data) => { this.setSingle(data); })
        .catch((error) => { this.fail(error); })
    }
  }

  setSingle(flow) {
    return flow;
  }

  done() {
    return (dispatch) => { dispatch(); }
  }

  load() {
    return (dispatch) => { dispatch(); }
  }

  triggerUpdate(id, flow) {
    return (dispatch) => {
      dispatch();
      const config = {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: new Blob([JSON.stringify(flow)], {type: 'application/json'})
      };
      fetch ('flows/v1/flow/' + id, config)
        .then((response) => { this.update(); })
        .catch((error) => { this.fail(error); })
    }
  }

  update(flow) {
    return flow;
  }

  fail(error) {
    console.error(error);
    return error;
  }
}

alt.createActions(FlowActions, exports);
