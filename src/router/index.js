import Vue from 'vue'
import Router from 'vue-router'
import { permissionEnum } from '@/utils/permission.js'

Vue.use(Router)

import Layout from '@/layout'

// 避免 NavigationDuplicated
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

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
    permission: permissionEnum.ALLOCATE_PERMISSION          访问该路由需要的权限
  }
 */

// 所有权限通用路由表: 如首页和登录页和一些不用权限的公用页面
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {
          title: '工作台',
          icon: 'el-icon-s-home',
          affix: true
        }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: {
          title: '个人中心',
          icon: 'el-icon-s-custom',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/paper',
    component: Layout,
    redirect: '/paper/index/',
    children: [
      {
        path: 'index/:type',
        name: 'Paper',
        component: () => import('@/views/paper/index'),
        meta: {
          title: '论文管理',
          icon: 'el-icon-collection'
        }
      },
      {
        path: 'in-detail/:id/:tab',
        component: () => import('@/views/paper/internalDetail'),
        name: 'internalDetail',
        meta: {
          title: '论文详细',
          noCache: true,
          activeMenu: '/paper/index'
        },
        hidden: true
      },
      {
        path: 'ex-detail/:id/:tab',
        component: () => import('@/views/paper/externalDetail'),
        name: 'externalDetail',
        meta: {
          title: '论文详细',
          noCache: true,
          activeMenu: '/paper/index'
        },
        hidden: true
      },
      {
        path: 'pro-detail/:id/:tab',
        component: () => import('@/views/paper/paperByProfessorDetail'),
        name: 'professorPaperDetail',
        meta: {
          title: '论文详细',
          noCache: true,
          activeMenu: '/paper/index'
        },
        hidden: true
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

// 异步挂载的路由：动态需要根据权限加载的路由表
export const asyncRoutes = [
  {
    path: '/performance',
    component: Layout,
    redirect: '/performance/perfApplication',
    name: 'Performance',
    meta: {
      title: '绩效管理',
      icon: 'perf',
      breadcrumb: false
    },
    children: [
      {
        path: 'perfApplication',
        name: 'PerfApplication',
        component: () => import('@/views/perfApplication/index'),
        meta: {
          title: '绩效申请',
          icon: 'el-icon-edit-outline'
        }
      },
      {
        path: 'perfAudit',
        name: 'PerfAudit',
        component: () => import('@/views/perfAudit/index'),
        meta: {
          title: '绩效审核',
          icon: 'el-icon-coordinate',
          roles: ['admin', 'auditor'],
          permission: permissionEnum.REVIEW_PERFORMANCE_APPLICATION
        }
      },
      {
        path: 'performance_dc',
        name: 'Performance_dc',
        component: () => import('@/views/performance/dc-index'),
        meta: {
          title: '绩效汇总',
          icon: 'el-icon-notebook-2'
        }
      },
      {
        path: 'performance_ac',
        name: 'Performance_ac',
        component: () => import('@/views/performance/ac-index'),
        meta: {
          title: 'AC汇总',
          icon: 'el-icon-data-line'
        }
      },
      {
        path: 'schedule',
        name: 'Schedule',
        component: () => import('@/views/schedule/index'),
        meta: {
          title: '日程汇总',
          icon: 'el-icon-date'
        }
      }
    ]
  },

  {
    path: '/project',
    component: Layout,
    name: 'Project',
    meta: {
      title: '开发管理',
      icon: 'dev',
      // breadCrumbHide: true, // 面包屑不显示
      breadcrumb: false
    },
    children: [
      {
        path: 'index',
        name: 'Task',
        component: () => import('@/views/project/index'),
        meta: {
          title: '开发管理',
          icon: 'el-icon-s-cooperation'
        }
      },
      {
        path: 'detail/:id',
        name: 'Detail',
        component: () => import('@/views/project/components/detail'),
        meta: {
          title: '项目详情',
          icon: 'el-icon-s-finance',
          roles: ['admin', 'auditor', 'normal']
        },
        hidden: true
      }
    ]
  },
  {
    path: '/property',
    component: Layout,
    redirect: '/property/academic/',
    meta: {
      title: '资产管理',
      icon: 'prop',
      breadcrumb: false
    },
    children: [
      {
        path: 'academic/:type',
        name: 'academicProperty',
        component: () => import('@/views/property/academicProperty/index'),
        meta: {
          title: '学术资产',
          icon: 'el-icon-reading'
        }
      },
      {
        path: 'academic/process-detail/:id',
        name: 'processDetail',
        component: () =>
          import('@/views/property/academicProperty/components/processDetail'),
        meta: {
          title: '会议记录详情',
          noCache: true,
          activeMenu: '/property/academic'
        },
        hidden: true
      },
      {
        path: 'academic/dissertation-detail/:id',
        name: 'dissertationDetail',
        component: () =>
          import(
            '@/views/property/academicProperty/components/dissertationDetail'
          ),
        meta: {
          title: '毕业论文详情',
          noCache: true,
          activeMenu: '/property/academic'
        },
        hidden: true
      },
      {
        path: 'project/:type',
        name: 'projectProperty',
        component: () => import('@/views/property/projectProperty/index'),
        meta: {
          title: '项目资产',
          icon: 'el-icon-receiving'
        }
      },
      {
        path: 'event',
        name: 'eventProperty',
        component: () => import('@/views/property/eventProperty/index'),
        meta: {
          title: '团队产出',
          icon: 'el-icon-notebook-2'
        }
      },
      {
        path: 'eventDetail/:id',
        name: 'eventDetail',
        component: () =>
          import('@/views/property/eventProperty/component/eventDetail')
      },
      {
        path: 'prize',
        name: 'prizeProperty',
        component: () => import('@/views/property/prizeProperty/index'),
        meta: {
          title: '荣誉资产',
          icon: 'el-icon-trophy'
        }
      },
      {
        path: 'fixed',
        name: 'fixedProperty',
        component: () => import('@/views/property/fixedProperty/index'),
        meta: {
          title: '固定资产',
          icon: 'el-icon-box'
        }
      }
    ]
  },
  {
    path: '/application',
    component: Layout,
    redirect: '/application/patent/',
    meta: {
      title: '申请管理',
      icon: 'application',
      breadcrumb: false
    },
    children: [
      {
        path: 'patent/index',
        name: 'Patent',
        component: () => import('@/views/patent/index'),
        meta: {
          title: '专利申请审核',
          icon: 'el-icon-files',
          permission: permissionEnum.REVIEW_PATENT_APPLICATION
        }
      },
      {
        path: 'patent/detail/:id',
        component: () => import('@/views/patent/components/patentDetail'),
        name: 'patentDetail',
        meta: {
          title: '专利详细',
          noCache: true,
          activeMenu: '/application/patent'
        },
        hidden: true
      },
      {
        path: 'reimburse/index',
        name: 'Reimburse',
        component: () => import('@/views/reimburse/index'),
        meta: {
          title: '报销申请审核',
          icon: 'el-icon-money',
          permission: permissionEnum.REVIEW_REIMBURSE_APPLICATION
        }
      },
      {
        path: 'reimburse/detail/:id',
        component: () => import('@/views/reimburse/components/reimburseDetail'),
        name: 'reimburseDetail',
        meta: {
          title: '报销详细',
          noCache: true,
          activeMenu: '/application/reimburse'
        },
        hidden: true
      },
      {
        path: 'practice/index',
        name: 'Practice',
        component: () => import('@/views/practice/index'),
        meta: {
          title: '实习申请审核',
          icon: 'el-icon-suitcase',
          permission: permissionEnum.REVIEW_INTERNSHIP_APPLICATION
        }
      },
      {
        path: 'vm/index',
        name: 'VisualMachine',
        component: () => import('@/views/vm/index'),
        meta: {
          title: '虚拟机申请审核',
          icon: 'el-icon-monitor',
          permission: permissionEnum.REVIEW_VM_DEVICE_APPLICATION
        }
      },
      {
        path: 'myApplication/index',
        name: 'myApplication',
        component: () => import('@/views/myApplication/index'),
        meta: {
          title: '我的申请',
          icon: 'el-icon-collection'
        }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/index',
    meta: {
      title: '系统管理',
      icon: 'dev',
      breadcrumb: false
    },
    children: [
      // {
      //   path: 'index',
      //   name: 'System',
      //   component: () => import('@/views/sysMan/index'),
      //   meta: {
      //     title: '系统设置',
      //     icon: 'setting'
      //     // roles: ["admin", "auditor"],
      //   },
      //   hidden: true
      // },
      {
        path: 'boardEdit',
        name: 'scrollBoardEdit',
        component: () => import('@/views/sysMan/components/scrollBoard.vue'),
        meta: {
          title: '编辑公告栏',
          icon: 'el-icon-news',
          // roles: ["admin", "auditor"],
          permission: permissionEnum.EDIT_SCROLL_NEWS_BOARD
        }
      },
      {
        path: 'confMan',
        name: 'confMan',
        component: () => import('@/views/sysMan/components/confMan.vue'),
        meta: {
          title: '参数设置',
          icon: 'el-icon-set-up',
          // roles: ["admin", "auditor"],
          permission: permissionEnum.EDIT_STANDARD_PARAMETER
        }
      },
      {
        path: 'userMan',
        name: 'userMan',
        component: () => import('@/views/sysMan/components/userMan.vue'),
        meta: {
          title: '用户管理',
          icon: 'el-icon-user',
          // roles: ["admin", "auditor"],
          permission: permissionEnum.EDIT_ANY_USER_INFO
        }
      }
    ]
  }
]

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
