//桌面程序不支持cookie
//import Cookies from 'js-cookie'

// const TokenKey = 'nuist-competition'

// export function getToken() {
//   return Cookies.get(TokenKey)
// }

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }

// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }

//改用localStorage存储
const TokenKey = 'nuist-competition'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
