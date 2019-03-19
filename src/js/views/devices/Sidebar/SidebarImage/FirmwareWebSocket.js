import { Component } from 'react';
import PropTypes from 'prop-types';
import util from "Comms/util";
import toaster from 'Comms/util/materialize';

let imageSocket = null;
const socketio = require("socket.io-client");

class FirmwareWebSocket extends Component {
    componentDidMount() {
      const { onChange: rsi } = this.props;
      const target = `${window.location.protocol}//${window.location.host}`;
      const tokenUrl = `${target}/stream/socketio`;

      function init(token) {
        imageSocket = socketio(target, {
          query: `token=${token}`,
          transports: ["polling"],
        });
        imageSocket.on("all", (data) => {
          rsi(data);
        });

        imageSocket.on("error", (data) => {
            toaster.error(data);
            if (imageSocket !== null) imageSocket.close();
        });
      }

      function _getWsToken() {
        util
          ._runFetch(tokenUrl)
          .then((reply) => {
            init(reply.token);
          })
          .catch((error) => {
            toaster.error(error);
          });
      }

      _getWsToken();
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
};


export default FirmwareWebSocket;
