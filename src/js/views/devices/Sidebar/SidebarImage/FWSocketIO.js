import socketIO from 'socket.io-client';
import toaster from 'Comms/util/materialize';
import util from 'Comms/util';

let sio = null;

class FWSocketIO {
    static connect(deviceId, receivedImageInformation) {
        const initSocketIO = (token) => {
            sio = socketIO(util.getFullURL(), {
                query: {
                    token,
                },
                transports: ['polling'],
            });
            sio.on(deviceId, (data) => {
                receivedImageInformation(data);
            });
            sio.on('error', (data) => {
                toaster.error(data);
                FWSocketIO.disconnect();
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

export default FWSocketIO;
