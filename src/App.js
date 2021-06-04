/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Provider} from 'react-redux';
import store from './store';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View onLayout={this._handleLayout} style={[styles.container]}>
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
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  card: {
    backgroundColor: '#15202b',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
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
