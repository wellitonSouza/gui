import alt from '../alt'
import alarmsActions from '../actions/AlarmsActions'

class AlarmStore {
    constructor() {
        this.currentAlarms = [];
        this.historyAlarms = [];
        this.metaData = [];
        this.loading = true;
        this.error = null;

        this.bindListeners({
            handleFetchCurrentAlarmsList: alarmsActions.insertCurrentAlarms,
            handleFetchAlarmsHistoryList: alarmsActions.fetchAlarmsHistory,
            handleInsertCurrentAlarms: alarmsActions.insertCurrentAlarms,
            handleInsertHistoryAlarms: alarmsActions.insertHistoryAlarms,
            handleFailure: alarmsActions.alarmsFailed,
            handleLoad: alarmsActions.alarmsLoad
        });
    }

    countMetaAttributes(alarmList) {
        let meta = {
            Warning: 0,
            Minor: 0,
            Major: 0,
            Critical: 0
        };
        for (let alarm in alarmList.alarms) {
            meta[alarmList.alarms[alarm].severity] += 1;
        }
        return meta;

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
        this.currentAlarms = allAlarms.alarms;
        this.metaData = this.countMetaAttributes(allAlarms);
        this.error = null;
        this.loading = false;
    }

    handleInsertHistoryAlarms(historyAlarms) {
        this.historyAlarms.push(historyAlarms);
        this.error = null;
        this.loading = false;
    }

    handleLoad() {
        this.loading = true;
    }

    handleFailure(error) {
        this.error = error;
        this.loading = false;
    }
}

let _store = alt.createStore(AlarmStore, 'AlarmStore');
export default _store;
