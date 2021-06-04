/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {Provider, connect} from 'react-redux';
import store from './store';
import {updateFromCurrency} from './store/currency';

const isCryptoNameValid = crytoName =>
  crytoName && crytoName.length < 5 && /^[a-zA-Z]+$/.test(crytoName);

function onFromTextInputChange(value) {
  this.setFromCurrency(value);
  if (isCryptoNameValid(value)) {
    store.dispatch(updateFromCurrency(value));
  }
}

function onToTextInputChange(value) {
  this.setToCurrency(value);
}

function getCurrentConversionData() {}

const _App = props => {
  let [fromCurrency, setFromCurrency] = useState('BTC');
  let [toCurrency, setToCurrency] = useState('USD');

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={[styles.container]}>
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
              onPress={() => this.setState({click: this.state.click + 1})}>
              <Text style={styles.font}> Connect </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: 300,
              height: 100,
              flexDirection: 'row',
            }}>
            <TextInput
              onChangeText={onFromTextInputChange.bind({setFromCurrency})}
              defaultValue={fromCurrency}
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
              onChangeText={onToTextInputChange.bind({setToCurrency})}
              defaultValue={toCurrency}
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
          {!isCryptoNameValid(fromCurrency) ? (
            <Text>Please enter a valid from currency</Text>
          ) : !isCryptoNameValid(toCurrency) ? (
            <Text>Please enter a valid to currency</Text>
          ) : (
            <Text>{getCurrentConversionData()}</Text>
          )}
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
