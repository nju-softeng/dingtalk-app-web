import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }

      res.push(tmp)
    }
  })

  return res
}

function dfsAsynRoutes(routes, permissionList) {
  const res = []
  // console.log(routes instanceof Array);
  routes.forEach((route) => {
    const tmp = { ...route }
    if (checkPermission(tmp, permissionList)) {
      if (tmp.children) {
        tmp.children = dfsAsynRoutes(tmp.children, permissionList)
      }
      res.push(tmp)
    }
  })

  return res
}

function checkPermission(route, permissionList) {
  if (route.meta && route.meta.permission) {
    // console.log(route.meta.permission);
    // console.log(
    //   permissionList.some((item) => {
    //     return item.id === route.meta.permission.id;
    //   })
    // );
    return permissionList.some((item) => {
      return item.id === route.meta.permission.id
    })
  } else {
    return true
  }
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve) => {
      let accessedRoutes
      // console.log(roles);
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      // console.log(accessedRoutes);
      resolve(accessedRoutes)
    })
  },

  generateRoutesByPermissions({ commit }, permissionsList) {
    // console.log(permissionsList);
    return new Promise((resolve) => {
      const accessedRoutes = dfsAsynRoutes(asyncRoutes, permissionsList)
      commit('SET_ROUTES', accessedRoutes)
      // console.log(accessedRoutes);
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
