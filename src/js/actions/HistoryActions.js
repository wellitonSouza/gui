import toaster from 'Comms/util/materialize';
import historyManager from 'Comms/devices/HistoryManager';
import alt from '../alt';

class HistoryActions {
    failed(error) {
        toaster.error(error.message);
        return error;
    }

    updateAttrHistory(deviceId, attrLabel, value, newLabel) {
        return {
            deviceId,
            attrLabel,
            value,
            newLabel,
        };
    }

    fetchLastAttrDataByDeviceIDAndAttrLabel(deviceId, attrLabel, newLabel) {
        return (dispatch) => {
            dispatch();
            historyManager.getLastAttrDataByDeviceIDAndAttrLabel(deviceId, attrLabel)
                .then((response) => {
                    response.forEach((hist) => {
                        this.updateAttrHistory(hist.device_id, hist.attr, hist.value, newLabel);
                    });
                })
                .catch((error) => {
                    this.failed(error);
                });
        };
    }
}

export default alt.createActions(HistoryActions, exports);
