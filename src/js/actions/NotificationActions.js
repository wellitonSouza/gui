import toaster from 'Comms/util/materialize';
import alt from '../alt';

class NotificationActions {
    append(data) {
        return data;
    }

    load() {
        return true;
    }

    failed(error) {
        toaster.error(error.message);
        return error;
    }
}

export default alt.createActions(NotificationActions, exports);
