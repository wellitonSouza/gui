import socketIO from 'socket.io-client';
import toaster from 'Comms/util/materialize';
import NotificationActions from 'Actions/NotificationActions';
import util from 'Comms/util';

const notification = {
    fields: {
        subject: {
            operation: '=',
            value: 'debug',
        },
        level: {
            operation: '>',
            value: 2,
        },
    },
};

let sio = null;

class SocketIONotification {
    static connect() {
        const target = `${window.location.protocol}//${window.location.host}`;
        const tokenUrl = `${target}/stream/socketio`;

        function init(token) {
            sio = socketIO(target, {
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
                sio.emit('filter', JSON.stringify(notification));
            });
        }

        function getWsToken() {
            util._runFetch(tokenUrl)
                .then((reply) => {
                    init(reply.token);
                })
                .catch((error) => {
                    toaster.error(error.message);
                });
        }

        getWsToken();
    }

    static disconnect() {
        if (sio) sio.close();
    }
}

export default SocketIONotification;
