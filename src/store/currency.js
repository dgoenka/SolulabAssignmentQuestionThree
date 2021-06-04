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
      let {currentData} = action.payload;
      let currentIndex = state.data.findIndex(
        tradingData => tradingData.streamId === currentData[0],
      );
      let data =
        currentIndex >= 0
          ? state.data[currentIndex]
          : {streamId: currentData[0]};
      data.data = currentData;
      if (currentIndex < 0) {
        state.data.push(data);
      } else {
        state.data = [...state.data];
      }
    },
    updateStreamId: (state, action) => {
      let {fromTo, streamId} = action.payload;
      let currentIndex = state.data.findIndex(
        tradingData => tradingData.fromTo === fromTo,
      );
      let data = currentIndex >= 0 ? state.data[currentIndex] : {fromTo};
      data.streamId = streamId;
      if (currentIndex < 0) {
        state.data.push(data);
      } else {
        state.data[currentIndex] = data;
      }
      state.data = [...state.data];
    },
  },
});
export default slice.reducer;
// Actions
const {
  setFromCurrency,
  setToCurrency,
  updateData,
  updateStreamId,
} = slice.actions;

export {setFromCurrency, setToCurrency, updateData, updateStreamId};
