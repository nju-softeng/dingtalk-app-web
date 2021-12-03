<template>
  <div>
    <div class="card">
      <div class="user-profile">
        <div class="box-center">
          <el-avatar class="avatar" shape="square" :size="60" :src="avatar">{{
            user.name
          }}</el-avatar>
        </div>
        <div class="box-center" style="height:100px">
          <template v-if="edit === false">
            <div class="user-name text-center">{{ user.name }}</div>
            <div class="user-role text-center text-muted">
              {{ user.stuNum }}
            </div>
          </template>
          <template v-else>
            <div class="user-name text-center">
              <el-input v-model="user.name" style="width:180px" placeholder="姓名" />
              <el-input v-model="user.stuNum" style="width:180px;padding-top:10px" placeholder="学号" />
            </div>
          </template>

          <div class="text-center text-muted" style="padding-top:16px">
            <el-button v-if="edit === false" size="mini" style="width:180px" @click="edit = true">编辑资料</el-button>
            <el-button
              v-else
              size="mini"
              style="width:180px"
              @click="
                edit = false;
                submitUserinfo();
              "
            >确认</el-button>
          </div>
        </div>
      </div>

      <el-divider />

      <div style="height:100px">
        <div style="padding-left:30px;padding-top:20px;">
          <span style="color:#8c8c8c;font-size:14px">
            在读学位 :
          </span>
          <el-tag>
            {{ user.position }}
          </el-tag>
        </div>
        <div style="padding-left:30px;padding-top:10px">
          <span style="color:#8c8c8c;font-size:14px">
            当前 A C :
          </span>
          <span style="padding:20px">
            {{ acTotal }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserDetail, updateUserInfo } from '@/api/user'
import { getPerformance } from '@/api/performance'
export default {
  data() {
    return {
      edit: false,
      user: {
        name: '',
        avatar: '',
        position: '',
        stuNum: ''
      },
      acTotal: null
    }
  },
  created() {
    this.avatar = sessionStorage.getItem('avatar')
    getUserDetail().then(res => {
      this.user = res.data
    })
    getPerformance().then(res => {
      this.acTotal = res.data.acTotal
    })
  },
  methods: {
    submitUserinfo() {
      if (this.user.name === '') {
        this.$message({
          showClose: true,
          message: '请填写必要信息',
          type: 'warning'
        })
        getUserDetail().then(res => {
          this.user = res.data
        })
        return
      }
      updateUserInfo(this.user)
        .then(() => {
          this.$message({
            showClose: true,
            message: '更新成功',
            type: 'success'
          })
        })
        .finally(() => {
          getUserDetail().then(res => {
            this.user = res.data
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  padding: 2px 0px;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  background-color: white;
}

.box-center {
  margin: 0 auto;
  display: table;
}

.avatar {
  background-color: #409eff;
}

.text-muted {
  color: #777;
}

.user-profile {
  padding-top: 48px;
  padding-bottom: 24px;
  .user-name {
    font-size: 16px;
    color: #262626;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }
}
</style>
