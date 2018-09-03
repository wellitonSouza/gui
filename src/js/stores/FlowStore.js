import FlowActions from '../actions/FlowActions';

const alt = require('../alt');

class FlowStore {
    constructor() {
        this.error = null; // general error

        this.loading = false; // list pending request indicator
        this.flows = {}; // list of known flows

        this.flowName = '';
        this.newFlow = { name: '' };
        this.canvasLoading = true;
        this.waiting = false;

        this.bindListeners({
            fail: FlowActions.FAIL,
            fetch: FlowActions.FETCH,
            setFlows: FlowActions.SET,
            setName: FlowActions.SET_NAME,

            fetchFlow: FlowActions.FETCH_FLOW,
            setSingle: FlowActions.SET_SINGLE,

            done: FlowActions.DONE,
            load: FlowActions.LOAD,

            triggerUpdate: FlowActions.TRIGGER_UPDATE,
            update: FlowActions.UPDATE,

            triggerCreate: FlowActions.TRIGGER_CREATE,
            create: FlowActions.CREATE,
            triggerRemove: FlowActions.TRIGGER_REMOVE,
            remove: FlowActions.REMOVE,
        });
    }

    done() {
        this.canvasLoading = false;
    }

    load() {
        this.canvasLoading = true;
    }

    fetch() {
        this.error = null;
        this.flows = {};
        this.loading = true;
    }

    setFlows(flows) {
        this.error = null;
        this.loading = false;

        this.flows = {};
        flows.map((i) => {
            this.flows[i.id] = JSON.parse(JSON.stringify(i));
        });
    }

    fetchFlow() {
        this.error = null;
        this.loading = true;
    }

    setSingle(flow) {
        this.error = null;
        this.loading = false;
        this.flows[flow.flow.id] = JSON.parse(JSON.stringify(flow.flow));
        this.flowName = flow.flow.name;
    }

    triggerUpdate() {
        this.error = null;
        this.waiting = true;
    }

    update(flow) {
        this.error = null;
        this.waiting = false;
        this.flows[flow.id] = JSON.parse(JSON.stringify(flow));
    }

    triggerCreate() {
        this.error = null;
        this.waiting = true;
    }

    create(flow) {
        this.error = null;
        this.waiting = false;

        this.newFlow = { name: '' };
        this.flows[flow.flow.id] = flow.flow;
    }

    triggerRemove() {
        this.error = null;
        this.waiting = true;
    }

    remove(id) {
        this.error = null;
        this.waiting = false;
        delete this.flows[id];
    }

    fail(error) {
        this.error = error;
        this.loading = false;
        this.waiting = false;
    }

    setName(name) {
        this.flowName = name;
    }
}

const _store = alt.createStore(FlowStore, 'FlowStore');
export default _store;
