import util from '../util/util';

class ExportManager {
    constructor() {
        this.baseUrl = '';
    }

    export() {
        return util.GET(`${this.baseUrl}/export`);
    }
}

const exportManager = new ExportManager();
export default exportManager;
