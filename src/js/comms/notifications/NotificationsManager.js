import { baseURL } from 'Src/config';
import util from '../util/util';

class NotificationsManager {
    /**
     *
     * @param subject
     * @returns {*}
     */
    getNotificationsHistory(subject) {
        return util.GET(`${baseURL}history/notifications/history/?subject="${subject}"`);
    }
}

const notificationsManager = new NotificationsManager();
export default notificationsManager;
