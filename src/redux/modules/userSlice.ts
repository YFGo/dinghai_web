import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { StorageEnum } from '@/types/enum'
import type { UserInfo } from '@/types/entity'
import type { TokenPair } from '@/api/services/user'
import { getToken, setToken, clearToken } from '@/utils/storage'

interface UserState {
  userInfo: Partial<UserInfo>
  userToken: TokenPair
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  userInfo: {},
  userToken: { access_token: '', refresh_token: '' },
  loading: false,
  error: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 设置用户信息
    setUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      state.userInfo = action.payload
      localStorage.setItem(StorageEnum.UserInfo, JSON.stringify(action.payload))
    },

    // 设置用户Token（包含accessToken和refreshToken）
    setUserToken: (state, action: PayloadAction<TokenPair>) => {
      state.userToken = action.payload
      setToken('access_token', action.payload.access_token)
      setToken('refresh_token', action.payload.refresh_token)
    },

    // 从存储同步Token到state
    syncTokenFromStorage: state => {
      const access_token = getToken('access_token') || ''
      const refresh_token = getToken('refresh_token') || ''
      state.userToken = { access_token, refresh_token }
    },

    // 清除用户信息和Token
    clearUserInfoAndToken: state => {
      state.userInfo = {}
      state.userToken = { access_token: '', refresh_token: '' }
      clearToken()
      localStorage.removeItem(StorageEnum.UserInfo)
    },

    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    // 设置错误信息
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  }
})

// 导出 actions
export const { setUserInfo, setUserToken, syncTokenFromStorage, clearUserInfoAndToken, setLoading, setError } = userSlice.actions

// 创建 selector 获取 token
export const selectUserToken = (state: { user: UserState }) => state.user.userToken

// 导入createSelector用于记忆化选择器
import { createSelector } from '@reduxjs/toolkit'

// 创建记忆化的selector获取用户权限
const selectUserState = (state: { user: UserState }) => state.user
export const selectUserPermission = createSelector(
  [selectUserState],
  (userState) => userState.userInfo?.permissions || []
)

// 自定义hook：获取用户权限
export function useUserPermission() {
  const permissions = useSelector(selectUserPermission)
  return permissions
}

export default userSlice.reducer
