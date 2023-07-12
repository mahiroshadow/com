import request from '@/utils/request'

//用户登录
export function login(data) {
  return request({
    url: 'http://112.74.58.26:13390/userLogin',
    method: 'post',
    data
  })
}

//解析token获取用户信息
export function getInfo(token) {
  return request({
    url: 'http://112.74.58.26:13390/parseToken',
    method: 'post',
    data: JSON.stringify({ token })
  })
}
//用户登出
export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
