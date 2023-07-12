import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/bigData/dataShow',
  },
  {
    path: '/bigData',
    component: Layout,
    children: [{
      path: 'dataShow',
      name: '大数据展示',
      component: () => import('@/views/BigData/index'),
      meta: { title: '大数据展示', icon: 'dashboard' }
    }]
  },
  {
    path: '/data',
    component: Layout,
    redirect: '/data/train',
    name: '数据服务',
    meta: { title: '数据服务', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'train',
        name: '训练集总览',
        component: () => import('@/views/train/index'),
        meta: { title: '训练集总览' }
      }
      , {
        path: 'test',
        name: '测试集数据总览',
        component: () => import('@/views/test/index'),
        meta: { title: '测试集数据总览' }
      }, {
        path: 'csvreader',
        component: () => import('@/views/csvshow/index'),
        hidden: true
      }
    ]
  },
  {
    path: '/model',
    component: Layout,
    redirect: '/model/myModel',
    name: '模型',
    meta: {
      title: '模型中心',
      icon: 'nested'
    },
    children: [
      {
        path: 'myModel',
        component: () => import('@/views/model/myModel/index'),
        name: 'myModel',
        meta: { title: '我的模型' }
      },
      {
        path: 'createModel',
        component: () => import('@/views/model/createModel/index'),
        name: 'createModel',
        meta: { title: '创建模型' }
      },
      {
        path: 'trainModel',
        component: () => import('@/views/model/trainModel/index'),
        name: 'trainModel',
        meta: { title: '训练模型' }
      },
      {
        path: 'validateModel',
        component: () => import('@/views/model/validateModel/index'),
        name: 'validateModel',
        meta: { title: '外部数据验证' }
      },
      {
        path: 'evaluate',
        component: () => import('@/views/modelEvaluate/index'),
        hidden: true
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
