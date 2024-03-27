const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.name,
  uid: (state) => state.user.uid,
  roles: (state) => state.user.roles,
  permission_routes: (state) => state.permission.routes,
  size: (state) => state.app.size,
  introduction: (state) => state.user.introduction,
  permissionList: (state) => state.user.permissionList
}
export default getters
