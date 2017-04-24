
var alt = require('../alt');

class FlowActions {

  fetch(login) {
    return (dispatch) => {
      fetch('flows/flow')
        .then((response) => {return response.json()})
        .then((data) => { this.set(data.flows) })
        .catch((error) => { this.fail(error)})
    }
  }

  set(flows) {
    return flows;
  }

  triggerUpdate(id, flow) {
    return (dispatch) => {
      dispatch();
      const config = {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: new Blob([JSON.stringify(flow)], {type: 'application/json'})
      };
      fetch ('flows/flow/' + id, config)
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
