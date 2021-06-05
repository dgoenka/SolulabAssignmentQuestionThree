/* global WebSocket */
/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  View,
} from 'react-native';
import {connect, Provider} from 'react-redux';
import store from './store';
import {updateData, updateStreamId} from './store/currency';
import WS from './provider/WebSocket';

const isCryptoNameValid = crytoName =>
  crytoName &&
  crytoName.length > 2 &&
  crytoName.length < 5 &&
  /^[a-zA-Z]+$/.test(crytoName);

const onMessage = message => {
  let currentData = JSON.parse(message.data);
  console.log('in App.onMessage, message is: ' + message);
  if (Array.isArray(currentData)) {
    if (Array.isArray(currentData[1])) {
      store.dispatch(updateData({currentData}));
    }
  } else {
    let currency = store.getState().currency;
    let fromTo = `${currency.fromCurrency}${currency.toCurrency}`;
    store.dispatch(updateStreamId({fromTo, streamId: currentData.chanId}));
  }
};

function getCurrentConversionData() {
  let currency = store.getState().currency;
  let fromTo = `${currency.fromCurrency}${currency.toCurrency}`;
  let data = currency.data.find(dataInArr => dataInArr.fromTo === fromTo);
  console.log(
    'in App.getCurrentConversionData, data is:\n' +
      JSON.stringify(data, null, 2),
  );
  let num = Number((((data ?? {})['data'] ?? {})['1'] ?? [])[6] ?? '0');
  return num.toFixed(2);
}

function getStreamId() {
  let currency = store.getState().currency;
  let fromTo = `${currency.fromCurrency}${currency.toCurrency}`;
  let data = currency.data.find(dataInArr => dataInArr.fromTo === fromTo);
  return Number(((data ?? {})['data'] ?? {})['0'] ?? '');
}

const _App = props => {
  let [fromCurrency, setFromCurrency] = useState(props.currency.fromCurrency);
  let [toCurrency, setToCurrency] = useState(props.currency.toCurrency);
  let [, setLastRendered] = useState(Date.now());
  let ws = useRef(null);

  const subscribe = (from, to) => {
    let msgStr = JSON.stringify({
      event: 'subscribe',
      channel: 'ticker',
      symbol: `${from}${to}`,
    });
    ws.current.send(msgStr);
  };

  const unsubscribe = () => {
    let msgStr = JSON.stringify({
      event: 'unsubscribe',
      channel: 'ticker',
      chanId: getStreamId(),
    });
    ws.current.send(msgStr);
  };

  const onFromTextInputChange = value => {
    setFromCurrency(value);
    if (isCryptoNameValid(value)) {
      unsubscribe();
      setFromCurrency(value);
      subscribe(value, toCurrency);
    }
  };
  const onToTextInputChange = value => {
    setToCurrency(value);
    if (isCryptoNameValid(value)) {
      unsubscribe();
      setToCurrency(value);
      subscribe(fromCurrency, value);
    }
  };

  const connectDisconnectWebsocket = () => {
    if (ws.current) {
      if (ws.current.getReadyState() === window.WebSocket.CLOSED) {
        ws.current.open();
      } else {
        ws.current.close();
      }
    }
  };

  const isNormalClose = code => {
    switch (Platform.OS) {
      case 'ios':
        return code === 1001;
      case 'android':
        return code === 1000;
      case 'web':
        return code === 1005;
    }
  };

  const onClose = event => {
    console.log('in App.onclose, event.code is: ' + event.code);
    if (isNormalClose(event.code)) {
      setLastRendered(Date.now());
    } else {
      ws.current.open();
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={[styles.container]}>
        <WS
          ref={ws}
          url="wss://api-pub.bitfinex.com/ws/2"
          onOpen={() => {
            subscribe(props.currency.fromCurrency, props.currency.toCurrency);
            setLastRendered(Date.now());
          }}
          onMessage={onMessage}
          onClose={onClose}
        />
        <View style={styles.card}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <Text style={[styles.font, {fontSize: 24}]}>BITINFINEX</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={connectDisconnectWebsocket}>
              <Text style={styles.font}>
                {!ws.current || ws.current.getReadyState() === WebSocket.CLOSED
                  ? 'Connect'
                  : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={{marginVertical: 30, color: 'white'}}>
            Press on either part of the symbol to modify it
          </Text>
          <View
            style={{
              width: '100%',
              height: 70,
              flexDirection: 'row',
            }}>
            <TextInput
              onChangeText={onFromTextInputChange}
              value={fromCurrency}
              placeholder="From"
              style={{
                width: '50%',
                height: '100%',
                textAlign: 'right',
                fontSize: 50,
                color: 'white',
              }}
            />
            <TextInput
              onChangeText={onToTextInputChange}
              value={toCurrency}
              placeholder="To"
              style={{
                width: '50%',
                height: '100%',
                textAlign: 'left',
                fontSize: 50,
                color: 'white',
              }}
            />
          </View>
          <Text
            style={{
              width: '100%',
              height: 100,
              textAlign: 'center',
              fontSize: 50,
              color: 'white',
            }}>
            {!isCryptoNameValid(fromCurrency)
              ? 'Please enter a valid from currency'
              : !isCryptoNameValid(toCurrency)
              ? 'Please enter a valid to currency'
              : getCurrentConversionData()}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const App = connect(state => ({currency: state.currency}))(_App);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  card: {
    backgroundColor: '#15202b',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  font: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  actionView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#71c9f8',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    paddingVertical: 20,
    borderRadius: 5,
  },
});

const WrappedApp = props => (
  <Provider store={store}>
    <App {...props} />
  </Provider>
);

export default WrappedApp;
