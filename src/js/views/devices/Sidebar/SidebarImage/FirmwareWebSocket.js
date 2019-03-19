import React, { Component } from 'react';
import PropTypes from 'prop-types';
import util from "Comms/util";


class FirmwareWebSocket extends Component {
    constructor(props) {
      super(props);
    }

    componentDidMount() {
      const { onChange: rsi } = this.props;
      const socketio = require("socket.io-client");
      const target = `${window.location.protocol}//${window.location.host}`;
      const token_url = `${target}/stream/socketio`;

      function _getWsToken() {
        util
          ._runFetch(token_url)
          .then((reply) => {
            init(reply.token);
          })
          .catch((error) => {
            toaster.error(error);
          });
      }

      function init(token) {
        imageSocket = socketio(target, {
          query: `token=${token}`,
          transports: ["polling"],
        });
        imageSocket.on("all", (data) => {
          rsi(data);
        });

        imageSocket.on("error", (data) => {
          if (imageSocket !== null) imageSocket.close();
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
