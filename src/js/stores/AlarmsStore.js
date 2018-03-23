import alt from '../alt'
import AlarmsActions from '../actions/AlarmsActions'

class AlarmStore {
    constructor() {
        this.currentAlarms = [];
        this.historyAlarms = [];
        this.loading = false;
        this.error = null;

        this.bindListeners({
            handleFetchCurrentAlarmsList: AlarmsActions.FETCH_CURRENT_ALARMS,
            handleFetchAlarmsHistoryList: AlarmsActions.FETCH_ALARMS_HISTORY,
            handleInsertCurrentAlarms: AlarmsActions.INSERT_CURRENT_ALARMS,
            handleInsertHistoryAlarms: AlarmsActions.INSERT_HISTORY_ALARMS,
            handleFailure: AlarmsActions.ALARMS_FAILED
        });
    }


    handleFetchCurrentAlarmsList() {
        this.currentAlarms = [];
        this.loading = true;
    }

    handleFetchAlarmsHistoryList() {
        this.historyAlarms = [];
        this.loading = true;
    }

    handleInsertCurrentAlarms(allAlarms) {
        this.currentAlarms = allAlarms;
        this.error = null;
        this.loading = false;
    }

    handleInsertHistoryAlarms(historyAlarms) {
        this.historyAlarms.push(historyAlarms);
        this.error = null;
        this.loading = false;
    }

    handleFailure(error) {
        this.error = error;
        this.loading = false;
    }
}

let _store = alt.createStore(AlarmStore, 'AlarmStore');
export default _store;
