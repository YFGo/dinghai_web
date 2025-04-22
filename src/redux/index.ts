// store/index.js

import { configureStore } from '@reduxjs/toolkit';
import { counterReducer } from './modules/counterSlice';

// 创建根 store
const store = configureStore({
  reducer: {
    counter: counterReducer,  // 将源 reducer 组合到根 store 中
  },
});

export default store;