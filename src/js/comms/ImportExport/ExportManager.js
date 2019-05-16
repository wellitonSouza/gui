import util from '../util/util';

class ExportManager {
    constructor() {
        this.baseUrl = '';
    }

    export() {

        const headers = {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Content-Disposition': 'attachment; filename="download"'
        }

        return util.GET(`${this.baseUrl}/export`, headers);
    }
}

const exportManager = new ExportManager();
export default exportManager;
