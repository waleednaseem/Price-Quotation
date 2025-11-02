import Cookies from 'js-cookie'

export const TOKEN_KEY = 'auth_token'
export const USER_KEY = 'user_data'

export const setAuthToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { 
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })
}

export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY)
}

export const removeAuthToken = () => {
  Cookies.remove(TOKEN_KEY)
}

export const setUserData = (userData: any) => {
  Cookies.set(USER_KEY, JSON.stringify(userData), {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })
}

export const getUserData = () => {
  const userData = Cookies.get(USER_KEY)
  return userData ? JSON.parse(userData) : null
}

export const removeUserData = () => {
  Cookies.remove(USER_KEY)
}

export const clearAuth = () => {
  removeAuthToken()
  removeUserData()
}