import toaster from 'Comms/util/materialize';
import notificationsManager from 'Comms/notifications/NotificationsManager';
import alt from '../alt';

class NotificationActions {
    append(data) {
        return data;
    }

    updateList(data) {
        return data;
    }

    load() {
        return true;
    }

    failed(error) {
        toaster.error(error.message);
        return error;
    }

    /**
     *
     * @param subject
     * @returns {Function}
     */
    fetchNotificationsFromHistory(subject) {
        return (dispatch) => {
            dispatch();
            notificationsManager.getNotificationsHistory(subject)
                .then((response) => {
                    this.updateList(response.notifications);
                })
                .catch((error) => {
                    this.failed(error);
                });
        };
    }
}

export default alt.createActions(NotificationActions, exports);
