import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import getters from '@/store/getters'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (sessionStorage.getItem('token')) {
    // 判断是否有token
    // console.log('判断是否有token', to.path)
    if (to.path === '/login') {
      // next({ path: '/' }) // 如果已登录，重定向到'/'
      next()
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        // console.log('hasGetUserInfo')
        next()
      } else {
        // console.log('!hasGetUserInfo')
        try {
          await store.dispatch('user/_getInfo') // 获取用户信息

          // 基于角色生成可以获得的路由
          // const accessRoutes = await store.dispatch(
          //   "permission/generateRoutes",
          //   [sessionStorage.getItem("role")]
          // );
          // console.log("sjdhfskfh");
          // console.log(getters.permissionList(store.state));
          const accessRoutes = await store.dispatch(
            'permission/generateRoutesByPermissions',
            getters.permissionList(store.state)
          )
          // 动态添加可访问路由表
          for (const x of accessRoutes) {
            router.addRoute(x)
          }
          // router.addRoutes(accessRoutes)
          // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          // await store.dispatch("user/resetToken");
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.

      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
