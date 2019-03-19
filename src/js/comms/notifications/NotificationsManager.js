import util from '../util/util';

class NotificationsManager {
    constructor() {
        this.baseUrl = '/history/notifications/history/';
    }

    /**
     *
     * @param subject
     * @returns {*}
     */
    getNotificationsHistory(subject) {
        return util.GET(`${this.baseUrl}?subject="${subject}"`);
    }
}

const notificationsManager = new NotificationsManager();
export default notificationsManager;
