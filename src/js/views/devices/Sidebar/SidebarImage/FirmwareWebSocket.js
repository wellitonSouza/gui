import { Component } from 'react';
import PropTypes from 'prop-types';
import util from 'Comms/util';
import toaster from 'Comms/util/materialize';
import socketIO from 'socket.io-client';

let imageSocket = null;


class FirmwareWebSocket extends Component {
    componentDidMount() {
        const { onChange: rsi } = this.props;
        const { deviceId } = this.props;

        function init(token) {
            imageSocket = socketIO(util.getFullURL(), {
                query: `token=${token}`,
                transports: ['polling'],
            });

            imageSocket.on(deviceId, (data) => {
                rsi(data);
            });

            imageSocket.on('error', (data) => {
                toaster.error(data);
                if (imageSocket !== null) imageSocket.close();
            });
        }

        util.getTokenSocketIO()
            .then((response) => {
                init(response.token);
            })
            .catch((error) => {
                toaster.error(error.message);
            });
    }

    componentWillUnmount() {
        if (imageSocket !== null) imageSocket.close();
    }

    render() {
        return null;
    }
}

FirmwareWebSocket.propTypes = {
    onChange: PropTypes.func.isRequired,
    deviceId: PropTypes.string,
};

FirmwareWebSocket.defaultProps = {
    deviceId: 'all',
};

export default FirmwareWebSocket;
