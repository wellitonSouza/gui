import util from '../util/util';

class HistoryManager {
    constructor() {
        this.baseUrl = '/history/device';
    }

    getLastAttrDataByDeviceIDAndAttrLabel(deviceId, attrLabel) {
        return util.GET(`${this.baseUrl}/${deviceId}/history?lastN=1&attr=${attrLabel}`);
    }
}

const historyManager = new HistoryManager();
export default historyManager;
