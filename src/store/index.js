import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import currency from './currency';
const reducer = combineReducers({
  currency,
});
const store = configureStore({
  reducer,
});
export default store;
