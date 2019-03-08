import socketIO from 'socket.io-client';
import NotificationActions from 'Actions/NotificationActions';
import util from 'Comms/util';

let sio;

class SocketIONotification {
    connect() {
        const target = `${window.location.protocol}//${window.location.host}`;
        const tokenUrl = `${target}/stream/socketio`;

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
                console.log('connectOnSocket');
                /* if (device_detail_socket) device_detail_socket.close(); */
                // getWsToken();
            });
        }

        function getWsToken() {
            util._runFetch(tokenUrl)
                .then((reply) => {
                    init(reply.token);
                })
                .catch((error) => {
                    // console.log('Failed!', error);
                });
        }

        getWsToken();
    }

    static disconnect() {
        if (sio) sio.close();
    }
}

const socketIONotification = new SocketIONotification();
export default socketIONotification;
