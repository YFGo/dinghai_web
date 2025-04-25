
export const getToken = (key: string): string | null => {
  return localStorage.getItem(key)
}

export const setToken = <T>(key:string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value))
}
export const removeToken = (key: string): void => {
  localStorage.removeToken(key)
}
export const clearToken = () => {
  localStorage.clear()
}
