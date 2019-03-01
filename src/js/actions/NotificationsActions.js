import toaster from 'Comms/util/materialize';
import alt from '../alt';

class NotificationsActions {
    load() {
        return true;
    }

    failed(error) {
        toaster.error(error.message);
        return error;
    }
}

export default alt.createActions(NotificationsActions, exports);
