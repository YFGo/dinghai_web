// src/api/types/auth.ts
export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn?: number // 建议添加过期时间
}

// src/api/types/user.ts
export interface UserInfo {
  id: number
  name: string
  roles: string[]
  avatar?: string   // 建议补充完整用户字段
}