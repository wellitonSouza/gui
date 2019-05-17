import ImportManager from '../comms/ImportExport/ImportManager';
import ExportManager from '../comms/ImportExport/ExportManager';
import toaster from '../comms/util/materialize';

const alt = require('../alt');

class ImportExportActions {
    exportFile(file) {
        return file;
    }

    importFile() {
        return true;
    }

    import(data) {
        const newData = data;
        return (dispatch) => {
            dispatch();
            ImportManager.import(newData)
                .then((response) => {
                    this.importFile(response);
                })
                .catch((error) => {
                    this.importFailed(error);
                });
        };
    }

    export() {
        return (dispatch) => {
            dispatch();
            ExportManager.export()
                .then((file) => {
                    const text = new global.Blob([JSON.stringify(file)], { type: 'text/json' });
                    const atag = global.document.createElement('a');
                    global.document.body.appendChild(atag);
                    atag.href = URL.createObjectURL(text);
                    atag.download = 'DojotData.json';
                    atag.click();
                    this.exportFile(text);
                    global.document.body.removeChild(atag);
                })
                .catch((error) => {
                    this.exportFailed(error);
                });
        };
    }

    importFailed(error) {
        toaster.error(error.message);
        return error;
    }

    exportFailed(error) {
        toaster.error(error.message);
        return error;
    }
}

const _importexport = alt.createActions(ImportExportActions, exports);
export default _importexport;
