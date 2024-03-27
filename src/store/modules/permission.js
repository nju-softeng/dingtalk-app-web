import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 * @deprecated
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
 * @deprecated
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

function dfsAsyncRoutes(routes, permissionList) {
  const res = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (checkPermission(tmp, permissionList)) {
      if (tmp.children) {
        tmp.children = dfsAsyncRoutes(tmp.children, permissionList)
      }
      // console.log(tmp.children)
      if (tmp.children instanceof Array) {
        if (tmp.children.length !== 0) res.push(tmp)
      } else {
        res.push(tmp)
      }
    }
  })

  return res
}

function checkPermission(route, permissionList) {
  if (route.meta && route.meta.permission) {
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
  /**
   * @deprecated
   * @param commit
   * @param roles
   * @returns {Promise<unknown>}
   */
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
      const accessedRoutes = dfsAsyncRoutes(asyncRoutes, permissionsList)
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
