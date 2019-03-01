import alt from '../alt';
import notificationsActions from '../actions/NotificationsActions';

class NotificationStore {
    constructor() {
        this.loading = true;
        this.error = null;

        this.bindListeners({
            handleFailure: notificationsActions.failed,
            handleLoad: notificationsActions.load,
        });
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
