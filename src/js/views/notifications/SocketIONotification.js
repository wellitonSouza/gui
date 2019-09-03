import socketIO from 'socket.io-client';
import toaster from 'Comms/util/materialize';
import NotificationActions from 'Actions/NotificationActions';
import util from 'Comms/util';

const filterLevelNotification = {
    fields: {
        subject: {
            operation: '=',
            value: 'user_notification',
        },
    },
};

let sio = null;

class SocketIONotification {
    static connect() {
        const initSocketIO = (token) => {
            sio = socketIO(util.getFullURL(), {
                query: {
                    token,
                    subject: 'dojot.notifications',
                },
                transports: ['polling'],
            });
            sio.on('notification', (data) => {
                NotificationActions.append(data);
            });
            sio.on('connect', () => {
                sio.emit('filter', JSON.stringify(filterLevelNotification));
            });
        };

        util.getTokenSocketIO()
            .then((response) => {
                initSocketIO(response.token);
            })
            .catch((error) => {
                toaster.error(error.message);
            });
    }

    static disconnect() {
        if (sio) sio.close();
    }
}

export default SocketIONotification;
