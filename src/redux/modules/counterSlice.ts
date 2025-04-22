//  store/modules/xxx.js

import { createSlice } from '@reduxjs/toolkit';

// 创建一个 slice
const counterSlice = createSlice({
  name: 'counter',  // 定义 slice 的名称
  initialState: {   // 初始化状态
    count: 0,       // 需要被全局维护的数据
  },
  reducers: {       // 定义修改状态的方法
    increment(state) {
      state.count += 1;  // 增加计数
    },
    decrement(state) {
      state.count -= 1;  // 减少计数
    },
    reset(state) {
      state.count = 0;    // 重置计数
    },
  },
});

// 导出 action 对象
export const { increment, decrement, reset } = counterSlice.actions;

// 导出 reducer 函数
export const counterReducer = counterSlice.reducer;