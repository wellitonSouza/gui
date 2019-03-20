/* eslint-disable */
var alt = require('../alt');

var GeoDeviceActions = require('../actions/GeoDeviceActions');
class GeoDeviceStore {
    constructor() {
        this.clusterers = [];
        this.error = null;
        this.loading = false;
        this.bindListeners({
            handleFetch: GeoDeviceActions.FETCH_DEVICES,
            handleSet: GeoDeviceActions.SET_DEVICES,
        });
    }
    handleFetch() {
        this.clusterers = [];
        this.loading = true;
    }
    handleSet(res) {
        this.clusterers = res.json.clusterers;
        this.error = null;
        this.loading = false;
    }

}
var _store = alt.createStore(GeoDeviceStore, 'GeoDeviceStore');
export default _store;
