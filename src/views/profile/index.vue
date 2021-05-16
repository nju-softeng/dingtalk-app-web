<template>
  <div class="app-container">
    <div class="content">
      <el-row :gutter="8">
        <el-col :span="7" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="17" :xs="24">
          <div class="card">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="周绩效日志" name="dctab" />
              <el-tab-pane label="AC日志" name="actab" />
              <el-tab-pane label="消息记录" name="msg" />
            </el-tabs>
            <component :is="activeTab" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'

export default {
  name: 'Profile',
  components: {
    UserCard,
    dctab: () => import('./components/DcTab'),
    actab: () => import('./components/AcTab'),
    msg: () => import('./components/Message')
  },
  data() {
    return {
      user: {},
      activeTab: 'dctab'
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'roles'])
  },
  created() {
    this.getUser()
    console.log(this.$route.query.tab)
    this.activeTab = this.$route.query.tab || 'dctab'
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        // role: this.roles.join(" | "),
        email: 'admin@test.com',
        avatar: this.avatar
      }
      console.log(this.user)
    }
  }
}
</script>
<style lang="scss">
.card {
  padding: 2px 20px;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  background-color: white;
}
.app-container {
  background-color: #fafafa;
  min-height: 92vh;
}

.content {
  margin-top: 8px;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
}
</style>
