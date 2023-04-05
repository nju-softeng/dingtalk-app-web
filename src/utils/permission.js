// import store from "@/store";

// /**
//  * @param {Array} value
//  * @returns {Boolean}
//  * @example see @/views/permission/directive.vue
//  */
// export default function checkPermission(value) {
//   if (value && value instanceof Array && value.length > 0) {
//     const roles = store.getters && store.getters.roles;
//     const permissionRoles = value;

//     const hasPermission = roles.some((role) => {
//       return permissionRoles.includes(role);
//     });

//     if (!hasPermission) {
//       return false;
//     }
//     return true;
//   } else {
//     console.error(`need roles! Like v-permission="['admin','editor']"`);
//     return false;
//   }
// }

export const permissionEnum = {
  ALLOCATE_PERMISSION: {
    id: 1,
    permissionName: "分配权限",
  },
  SET_INTERNSHIP_ALLOWED_PERIOD: {
    id: 2,
    permissionName: "设置实习期",
  },
  EDIT_ANY_USER_INFO: {
    id: 3,
    permissionName: "编辑用户信息",
  },
  EDIT_SCROLL_NEWS_BOARD: {
    id: 4,
    permissionName: "编辑滚动公告栏",
  },
  REVIEW_INTERNSHIP_APPLICATION: {
    id: 11,
    permissionName: "实习申请审核",
  },
  REVIEW_PATENT_APPLICATION: {
    id: 12,
    permissionName: "专利申请审核",
  },
  REVIEW_REIMBURSE_APPLICATION: {
    id: 13,
    permissionName: "报销申请审核",
  },
  REVIEW_VM_DEVICE_APPLICATION: {
    id: 14,
    permissionName: "虚拟机申请审核",
  },
};
