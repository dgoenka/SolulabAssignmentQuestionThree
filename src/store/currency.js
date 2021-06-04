import {createSlice} from '@reduxjs/toolkit';
// Slice
const slice = createSlice({
  name: 'currencies',
  initialState: {
    data: [],
    fromCurrency: 'BTC',
    toCurrency: 'USD',
  },
  reducers: {
    setFromCurrency: (state, action) => {
      state.fromCurrency = action.payload;
    },
    setToCurrency: (state, action) => {
      state.toCurrency = action;
    },
    updateData: (state, action) => {
      let {fromTo, currentData} = action.payload;
      let currentIndex = state.data.findIndex(
        tradingData => tradingData.fromTo === fromTo,
      );
      let data = currentIndex >= 0 ? state.data[currentIndex] : {fromTo};
      data.data = currentData;
      if (currentIndex < 0) {
        state.data.push(data);
      } else {
        state.data = [...state.data];
      }
    },
  },
});
export default slice.reducer;
// Actions
const {setFromCurrency, setToCurrency, updateData} = slice.actions;

const updateFromCurrency = fromCurrency => dispatch => {
  dispatch(setFromCurrency(fromCurrency));
  //call the websocket to register a from symbol
};

const updateToCurrency = toCurrency => dispatch => {
  dispatch(setToCurrency(toCurrency));
  //call the websocket to register a to symbol
};

export {updateFromCurrency, updateToCurrency, updateData};
