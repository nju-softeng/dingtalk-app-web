<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="周绩效日志" name="dctab">
                <dctab />
              </el-tab-pane>
              <el-tab-pane label="AC日志" name="actab">
                <actab />
              </el-tab-pane>
              <el-tab-pane label="消息记录" name="msg">
                <Message />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserCard from "./components/UserCard";

export default {
  name: "Profile",
  components: {
    UserCard,
    Dctab: () => import("./components/DcTab"),
    Actab: () => import("./components/AcTab"),
    Message: () => import("./components/Message")
  },
  data() {
    return {
      user: {},
      activeTab: "dctab"
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  },
  created() {
    this.getUser();
    console.log(this.$route.query.tab);
    this.activeTab = this.$route.query.tab || "dctab";
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        // role: this.roles.join(" | "),
        email: "admin@test.com",
        avatar: this.avatar
      };
      console.log(this.user);
    }
  }
};
</script>
