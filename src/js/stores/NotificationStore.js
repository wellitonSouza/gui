import util from 'Comms/util';
import alt from '../alt';
import notificationsActions from '../actions/NotificationActions';

class NotificationStore {
    constructor() {
        this.loading = true;
        this.error = null;
        this.notifications = [];

        this.bindListeners({
            handleFailure: notificationsActions.failed,
            handleLoad: notificationsActions.load,
            handleAppend: notificationsActions.append,
        });
    }

    handleAppend(data) {
        const dataObj = JSON.parse(data);
        const { timestamp, message, metaAttrsFilter: metas } = dataObj;
        const { device } = metas;

        this.notifications = [{
            message,
            device,
            time: Util.timestampToHourMinSec(timestamp),
            date: Util.timestampToDayMonthYear(timestamp),
        },
        ...this.notifications,
        ];
    }

    handleLoad() {
        this.loading = true;
    }

    handleFailure(error) {
        this.error = error;
        this.loading = false;
    }
}

export default alt.createStore(NotificationStore, 'NotificationStore');
