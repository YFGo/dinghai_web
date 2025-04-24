interface Token {
  id: string
  token: string
  // 可以根据需要添加其他字段
}

const storageToken = {
  set(key: string, value: Token): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error storing token:', error)
    }
  },
  get(key: string): Token | null {
    try {
      const value = localStorage.getItem(key)
      if (!value || value === 'undefined') {
        // 检查 value 是否为 undefined 或空字符串
        return null
      }
      return JSON.parse(value) as Token
    } catch (error) {
      console.error('Error retrieving token:', error)
      return null
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing token:', error)
    }
  }
}

export default storageToken
