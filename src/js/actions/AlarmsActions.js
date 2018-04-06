import alarmsManager from '../comms/alarms/AlarmsManager';
import Materialize from "materialize-css";
import alt from "../alt"


class AlarmsActions {

    alarmsLoad() {
        return true;
    }

    insertCurrentAlarms(currentList) {
        return currentList;
    }

    insertHistoryAlarms(HistoryList) {
        return HistoryList;
    }


    fetchCurrentAlarms() {
        return (dispatch) => {
            dispatch();
            alarmsManager.getAllCurrentAlarms()
                .then((alarmList) => {
                    this.insertCurrentAlarms(alarmList);
                })
                .catch((error) => {
                    this.alarmsFailed(error);
                });
        }
    }

    fetchAlarmsHistory() {
        return (dispatch) => {
            dispatch();
            alarmsManager.getHistoryWithoutNamespace()
                .then((alarmList) => {
                    this.insertHistoryAlarms(alarmList);
                })
                .catch((error) => {
                    this.alarmsFailed(error);
                });
        }
    }

    alarmsFailed(error) {
        Materialize.toast(error.message, 4000);
        return error;
    }
}

let _alarms = alt.createActions(AlarmsActions, exports);
export default _alarms;