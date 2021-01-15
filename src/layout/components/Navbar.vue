<template>
  <div class="navbar">
    <div class="navbar_wrap">
      <template v-if="device === 'mobile'">
        <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      </template>
      <template v-else>
        <topbar class="breadcrumb-container" />
      </template>

      <div class="right-menu">
        <!-- <el-dropdown class="right-menu-item ">
        <span class=" el-dropdown-link" style="color:#409EFF">
          <i class="el-icon-circle-plus el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>选项1</el-dropdown-item>
          <el-dropdown-item>选项2</el-dropdown-item>
          <el-dropdown-item>选项3</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->

        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <el-avatar fit="fill" shape="square" :size="35" class="user-avatar" :src="avatar">
              {{ name }}
            </el-avatar>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/profile/index">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <router-link to="/">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Topbar from './Topbar'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Topbar
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device', 'name'])
  },
  created() {
    console.log('头像')
    if (this.avatar == '') {
      console.log('null')
    }
    console.log(this.avatar)
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 48px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
  .navbar_wrap {
    max-width: 1305px;
    margin-left: auto;
    margin-right: auto;
  }

  .hamburger-container {
    line-height: 48px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 48px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 35px;
          height: 35px;
          border-radius: 10px;
          background-color: #409eff;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
