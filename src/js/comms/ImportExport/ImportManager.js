import { baseURL } from 'Src/config';
import util from '../util/util';

class ImportManager {
    import(file) {
        return util.POST(`${baseURL}import/`, file);
    }
}

const importManager = new ImportManager();
export default importManager;
