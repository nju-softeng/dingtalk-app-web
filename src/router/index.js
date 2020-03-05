import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Layout from "@/layout";

// 避免 NavigationDuplicated
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

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
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

//所有权限通用路由表: 如首页和登录页和一些不用权限的公用页面
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "Dashboard",
        meta: { title: "首页", icon: "dashboard", affix: true }
      }
    ]
  },
  {
    path: "/profile",
    component: Layout,
    redirect: "/profile/index",
    hidden: true,
    children: [
      {
        path: "index",
        component: () => import("@/views/profile/index"),
        name: "Profile",
        meta: { title: "Profile", icon: "user", noCache: true }
      }
    ]
  },
  {
    path: "/performance",
    component: Layout,
    redirect: "/performance/perfApplication",
    name: "Performance",
    meta: { title: "绩效管理", icon: "example" },
    children: [
      {
        path: "perfApplication",
        name: "PerfApplication",
        component: () => import("@/views/perfApplication/index"),
        meta: { title: "绩效申请", icon: "table" }
      },
      {
        path: "perfAudit",
        name: "PerfAudit",
        component: () => import("@/views/perfAudit/index"),
        meta: { title: "绩效审核", icon: "table" }
      },
      {
        path: "performance_dc",
        name: "Performance_dc",
        component: () => import("@/views/performance/dc-index"),
        meta: { title: "绩效汇总", icon: "tree" }
      },
      {
        path: "performance_ac",
        name: "Performance_ac",
        component: () => import("@/views/performance/ac-index"),
        meta: { title: "AC汇总", icon: "tree" }
      }
    ]
  },

  {
    path: "/task",
    component: Layout,
    name: "Task",
    meta: { title: "迭代绩效", icon: "component" },
    children: [
      {
        path: "manage",
        name: "Manage",
        component: () => import("@/views/task/manage"),
        meta: { title: "迭代分配", icon: "table" }
      },
      {
        path: "index",
        name: "Task",
        component: () => import("@/views/task/index"),
        meta: { title: "我的迭代", icon: "table" }
      },
      {
        path: "bug",
        name: "Bug",
        component: () => import("@/views/task/bug"),
        meta: { title: "bug报告", icon: "bug" }
      }
    ]
  },
  {
    path: "/paper",
    component: Layout,
    children: [
      {
        path: "index",
        name: "Paper",
        component: () => import("@/views/paper/index"),
        meta: { title: "论文管理", icon: "form" }
      },
      {
        path: "detail/:id",
        component: () => import("@/views/paper/detail"),
        name: "Detail",
        meta: { title: "详细", noCache: true, activeMenu: "/paper/index" },
        hidden: true
      },
      {
        path: "vote/:id",
        component: () => import("@/views/paper/vote"),
        name: "Vote",
        meta: { title: "投票", noCache: true, activeMenu: "/paper/index" },
        hidden: true
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

//异步挂载的路由：动态需要根据权限加载的路由表
export const asyncRoutes = [
  {
    path: "/test",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/test/index"),
        name: "test",
        meta: {
          title: "Test",
          icon: "tab"
        }
      }
    ]
  },
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    mode: "history", // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
