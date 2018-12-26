import util from '../util/util';

class ImportManager {
    constructor() {
        this.baseUrl = '';
    }

    import(file) {
        return util.POST(`${this.baseUrl}/import/`, file);
    }
}

const importManager = new ImportManager();
export default importManager;
