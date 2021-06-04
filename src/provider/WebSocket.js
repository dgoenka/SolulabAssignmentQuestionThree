/* global WebSocket */
/* eslint no-unused-vars: "off" */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class WS extends Component {
  state = {
    ws: null,
  };

  static defaultProps = {
    reconnect: false,
  };

  shouldComponentUpdate = () => false;

  getReadyState = () => {
    if (!this.state.ws) {
      return WebSocket.CLOSED;
    } else {
      return this.state.ws.readyState;
    }
  };

  static propTypes = {
    url: PropTypes.string.isRequired,
    reconnect: PropTypes.bool,
    onOpen: PropTypes.func,
    onMessage: PropTypes.func,
    onError: PropTypes.func,
    onClose: PropTypes.func,
  };

  open = () => this._handleWebSocketSetup();

  send = data => this.state.ws.send(data);

  close = () => this._handleWebSocketClose();

  componentDidMount() {
    this.reconnect = !!this.props.reconnect;
    this._handleWebSocketSetup();
  }

  componentWillUnmount() {
    this._handleWebSocketClose();
  }

  render = () => null;

  _handleWebSocketSetup = () => {
    const ws = new WebSocket(this.props.url);
    ws.onopen = () => {
      this.props.onOpen && this.props.onOpen();
    };
    ws.onmessage = event => {
      this.props.onMessage && this.props.onMessage(event);
    };
    ws.onerror = error => {
      this.props.onError && this.props.onError(error);
    };
    ws.onclose = () =>
      this.reconnect
        ? this._handleWebSocketSetup()
        : this.props.onClose && this.props.onClose();
    this.setState({ws});
  };

  _handleWebSocketClose = () => {
    this.reconnect = false;
    this.state.ws.close();
  };
}

export default WS;
