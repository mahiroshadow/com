import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })
/*用户没有登录之前的路由白名单*/
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  //开启加载条
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  //获取用户token
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      //用户进入登录界面时，如果用户已经登录则进入主界面
      next({ path: '/' })
      //关闭加载条
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.username
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          //获取用户信息
          await store.dispatch('user/getInfo')
          next()
        } catch (error) {
          //移除token重定向回登录界面
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  }
  //如果用户还没有生成token
  else {
    /*如果路由在白名单之中，可以随便转向*/
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    }
    /*路由不在白名单中不能跳转，需要返回登录界面*/
    else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
