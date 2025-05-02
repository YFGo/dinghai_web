import { configureStore } from '@reduxjs/toolkit'
import userReducer from './modules/userSlice'
import { syncTokenFromStorage } from './modules/userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer
  }
})

// 从 localStorage 初始化状态
const initializeStore = () => {
  // 从localStorage同步token到Redux状态
  // 确保页面刷新后仍能保持登录状态
  store.dispatch(syncTokenFromStorage())
}

initializeStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store