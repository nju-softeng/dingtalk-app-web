<template>
  <el-card shadow="never" style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>个人中心</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <el-avatar class="avatar" shape="square" :size="60" :src="avatar">{{
          user.name
        }}</el-avatar>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">
          {{ user.role }}
        </div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="education" />
          <el-tag>
            {{ user.position }}
          </el-tag>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted"></div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { getUserDetail } from "@/api/user";
export default {
  data() {
    return {
      user: {
        name: "",
        avatar: "",
        position: ""
      }
    };
  },
  created() {
    this.avatar = sessionStorage.getItem("avatar");
    getUserDetail().then(res => {
      console.log(res.data);
      this.user = res.data;
    });
  }
};
</script>

<style lang="scss" scoped>
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
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
