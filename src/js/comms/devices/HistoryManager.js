import { baseURL } from 'Src/config';
import util from '../util/util';

class HistoryManager {
    getLastAttrDataByDeviceIDAndAttrLabel(deviceId, attrLabel) {
        return util.GET(`${baseURL}history/device/${deviceId}/history?lastN=1&attr=${attrLabel}`);
    }
}

const historyManager = new HistoryManager();
export default historyManager;
