import Vue from "vue";
import VueRouter from "vue-router";
//import { Message } from "element-ui";
import store from "@/store";

Vue.use(VueRouter);

export const commonRoutes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index")
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/About.vue")
  }
];

export const asyncRoutes = [];

const createRouter = () => {
  return new VueRouter({
    routes: commonRoutes,
    scrollBehavior() {
      return { x: 0, y: 0 };
    }
  });
};

const router = createRouter();

// 解决addRoute不能删除动态路由问题
export function resetRouter() {
  const reset = createRouter();
  router.matcher = reset.matcher;
}

// 导航守卫
router.beforeEach(async (to, from, next) => {
  if (to.path === "/login") {
    next();
  } else {
    if (!store.getters.token) {
      console.log("hello");
      // const hasRoles = store.getters.roles.length > 0;
      // if (hasRoles) {
      //   next();
      // } else {
      //   try {
      //     const { roles } = await store.dispatch("user/_getInfo");
      //     const addRoutes = await store.dispatch(
      //       "permission/getAsyncRoutes",
      //       roles
      //     );
      //     router.addRoutes(addRoutes);
      //     // hack method to ensure that addRoutes is complete
      //     // set the replace: true, so the navigation will not leave a history record
      //     next({ ...to, replace: true });
      //   } catch (error) {
      //     Message.error(error);
      //   }
      // }
    } else {
      console.log("hello");
      next({
        path: "/login",
        query: {
          redirect: to.fullPath
        }
      });
    }
  }
});

export default router;
