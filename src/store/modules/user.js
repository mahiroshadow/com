import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { getUseravatarUrl, setUseravatarUrl } from '@/utils/userInfo'

const getDefaultState = () => {
  return {
    token: getToken(),
    username: '',
    avatar: getUseravatarUrl(),
    modelname: '',
    testName: '',
    trainName: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_MODELNAME: (state, modelname) => {
    state.modelname = modelname
  },
  SET_TRAINNAME: (state, trainName) => {
    state.trainName = trainName
  },
  SET_TESTNAME: (state, testName) => {
    state.testName = testName
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        console.log(data)
        //登录成功设置token
        commit('SET_TOKEN', data.userToken)
        //设置用户头像
        commit('SET_AVATAR', data.userAvatarUrl)
        setUseravatarUrl(data.userAvatarUrl)
        setToken(data.userToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (data.code == 500) {
          return reject('用户登录信息过期，请重新登录')
        }
        const { username } = data
        commit('SET_USERNAME', username)
        // commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  //用户登出
  logout({ commit, state }) {
    removeToken()
    resetRouter()
    commit('RESET_STATE')
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     removeToken() // must remove  token  first
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  //移除用户token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  modelnameStore({ commit }, modelname) {
    commit('SET_MODELNAME', modelname)
  },
  trainameStore({ commit }, trainName) {
    commit('SET_TRAINNAME', trainName)
  },
  testnameStore({ commit }, testName) {
    commit('SET_TESTNAME', testName)
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

