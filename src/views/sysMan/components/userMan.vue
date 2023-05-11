<template>
  <div class="app-container">
    <div>
      <el-tooltip
        class="item"
        effect="dark"
        content="用户进入应用时会自动导入，权限默认为普通用户"
        placement="right"
      >
        <el-button type="primary" @click="refreshUser">拉取钉钉用户</el-button>
      </el-tooltip>
      <!-- <span style="padding-left:100px;color: #999999; font-size:13px"
        >当前评审人:</span
      >
      <span
        v-for="(item, index) in auditors"
        :key="index"
        style="margin:0 5px; font-size:13px;color: #999999"
      >
        {{ item.name }}
      </span>
      <span
        v-if="auditors.length === 0"
        style="margin:0 5px; font-size:13px;color: #999999"
      >
        未设置
      </span> -->
    </div>
    <el-divider />
    <div class="filtrate">
      <el-input
        v-model="queryForm.name"
        placeholder="姓名"
        style="width:160px"
        clearable
        @change="search"
      />
      <el-select
        v-model="queryForm.position"
        style="margin-left:5px; width:160px"
        clearable
        placeholder="在读学历"
      >
        <el-option
          v-for="(item, index) in options"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button
        style="margin-left:5px"
        size="mini"
        icon="el-icon-search"
        @click="search"
        >搜索</el-button
      >
      <el-button
        size="mini"
        icon="el-icon-refresh-right"
        style="margin-left:5px"
        @click="refresh"
      >
        刷新
      </el-button>
      <el-button
        size="mini"
        type="error"
        plain
        icon="el-icon-s-release"
        style="float:right"
        @click="showDisableUser"
      >
        停用名单
      </el-button>
    </div>

    <div>
      <el-table
        :data="list"
        fit
        style="margin-top:10px;"
        :header-cell-style="{ background: '#eef1f6' }"
      >
        <el-table-column label="学号" align="center">
          <template slot-scope="{ row }">
            <span v-if="row.stuNum === undefined">未设置</span>
            <span>{{ row.stuNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="职位">
          <template slot-scope="{ row }">
            {{ row.position }}
            <span v-if="row.position === undefined">未设置</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="role"
          align="center"
          label="管理权限"
          width="150"
        >
          <template slot-scope="{ row }">
            <div style="overflow: auto; height: 30px;">
              <template v-if="row.permissionList.length !== 0">
                <el-tag
                  :key="permission.id"
                  v-for="permission in row.permissionList"
                  effect="plain"
                  >{{ permission.name }}</el-tag
                >
              </template>
              <template v-else>
                <el-tag type="info" effect="plain">无</el-tag>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="role"
          align="center"
          label="所属研究组"
          width="150"
        >
          <template slot-scope="{ row }">
            <div style="overflow: auto; height: 30px;">
              <template v-if="row.teamList.length !== 0">
                <el-tag
                  :key="team.id"
                  v-for="team in row.teamList"
                  effect="plain"
                  >{{ team.name }}</el-tag
                >
              </template>
              <template v-else>
                <el-tag type="info" effect="plain">无</el-tag>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              style="padding-right:8px"
              @click="editUserInfo(row)"
              >编辑</el-button
            >

            <el-popover
              v-model="row.visible"
              placement="top"
              title="停用后用户将移除绩效列表"
              width="195"
              style="font-size:13px"
              trigger="manual"
            >
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="row.visible = false"
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="
                    row.visible = false;
                    disableU(row.id);
                  "
                  >确定</el-button
                >
              </div>
              <el-button
                slot="reference"
                type="text"
                @click="row.visible = true"
                >停用</el-button
              >
            </el-popover>
          </template>
        </el-table-column>
        <template slot="empty">
          <div style="height:200px;">
            <div style="margin-top:100px;">
              <svg-icon icon-class="null" style="font-size:32px" /> <br />
            </div>
            <div style="line-height: 10px;">
              <span>无记录</span>
            </div>
          </div>
        </template>
      </el-table>

      <div style="margin-top:25px; display:flex; justify-content:center">
        <el-pagination
          :hide-on-single-page="total < 10 ? true : false"
          small
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="10"
          :current-page="currentPage"
          @prev-click="handlePrev"
          @next-click="handleNext"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <el-dialog
      title="编辑用户信息"
      :visible.sync="dialog"
      width="400px"
      :lock-scroll="false"
      @close="closeEdit()"
    >
      <div v-loading="loading">
        <el-form
          label-position="left"
          label-width="70px"
          :model="userForm"
          style="padding:0 10px;"
        >
          <el-form-item label="姓名">
            <span style="padding-left:5px">{{ userForm.name }}</span>
          </el-form-item>
          <el-form-item label="学号">
            <el-input
              v-model="userForm.stuNum"
              style="width:200px"
              placeholder="请输入学号"
            />
          </el-form-item>
          <el-form-item label="在读学位">
            <el-select
              v-model="userForm.position"
              style="width:200px"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="用户权限">
            <!-- <el-select
              v-model="userForm.authority"
              style="width:200px"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in authorityList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
            <PermissionEdit
              ref="permissionEdit"
              :userId="this.userForm.id"
            ></PermissionEdit>
          </el-form-item>
          <el-form-item label="研究组">
            <TeamEdit ref="teamEdit" :userId="this.userForm.id"> </TeamEdit>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEdit()">取 消</el-button>
        <el-button type="primary" @click="submitUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="停用列表"
      :lock-scroll="false"
      :visible.sync="disableDialog"
      width="400px"
    >
      <el-table :data="disablelist" height="600px">
        <el-table-column label="学号">
          <template slot-scope="{ row }">
            <span v-if="row.stuNum === undefined">未设置</span>
            <span>{{ row.stuNum }}</span>
          </template>
        </el-table-column>
        <el-table-column property="name" label="姓名" />
        <el-table-column prop="role" label="权限">
          <template slot-scope="{ row }">
            <el-tag v-if="row.authority === 0" type="info">普通用户</el-tag>
            <el-tag v-else type="success">评审人</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="recoverU(row.id)">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryUser,
  fetchAllUser,
  updateUserInfo,
  disableUser,
  enableUser,
  queryDisableUser,
} from "@/api/system";
import { listAuditors } from "@/api/user";
import PermissionEdit from "@/components/PermissionsEdit";
import TeamEdit from "@/components/TeamsEdit";
export default {
  components: { PermissionEdit, TeamEdit },
  data() {
    return {
      disableDialog: false,
      loading: false,
      userForm: {},
      dialog: false,
      total: 0,
      auditors: [],
      list: [],
      disablelist: [],
      queryForm: {
        stuNum: "",
        name: "",
        position: "",
        authority: null,
      },
      currentPage: 1,
      options: ["本科生", "专硕", "学硕", "博士生", "待定", "教师"],
      authorityList: [
        { label: "普通用户", value: 0 },
        { label: "评审人", value: 1 },
      ],
    };
  },
  created() {
    this.fetchUserList(0);
    listAuditors().then((res) => {
      this.auditors = res.data.auditorlist;
    });
  },
  methods: {
    showDisableUser() {
      this.disableDialog = true;
      queryDisableUser().then((res) => {
        this.disablelist = res.data;
      });
    },
    recoverU(uid) {
      enableUser(uid).then(() => {
        queryDisableUser().then((res) => {
          this.disablelist = res.data;
        });
        this.fetchUserList(this.currentPage - 1);
        this.$message({
          showClose: true,
          message: "恢复成功",
          type: "success",
        });
      });
    },
    disableU(uid) {
      disableUser(uid).then(() => {
        this.fetchUserList(this.currentPage - 1);
        this.$message({
          showClose: true,
          message: "禁用成功",
          type: "success",
        });
      });
    },
    editUserInfo(data) {
      console.log(data);
      this.userForm = data;
      this.dialog = true;
    },
    submitUserInfo() {
      this.loading = true;
      updateUserInfo(this.userForm)
        .then(() => {
          this.$notify({
            title: "成功",
            message: this.userForm.name + " 的信息保存成功",
            position: "bottom-right",
            type: "success",
          });
        })
        .then(() => {
          this.$refs.permissionEdit.submitPermissionChange();
        })
        .then(() => {
          this.$refs.teamEdit.submitTeamChange();
        })
        .then(() => {
          // 保证前面两个then中的异步操作都执行完之后再更新页面
          setTimeout(() => {
            this.loading = false;
            this.dialog = false;
            this.fetchUserList(this.currentPage - 1);
          }, 1000);
        });
    },

    // 分页获取数据
    handleCurrentChange(val) {
      if (val == this.currentPage) return;
      this.fetchUserList(val - 1);
      // console.log("handleCurrentChange");
    },
    handlePrev(val) {
      console.log(val);
      // this.currentPage = this.currentPage - 1;
      this.fetchUserList(val - 1);
    },
    handleNext(val) {
      console.log(val);
      this.loading = true;
      // this.currentPage = this.currentPage + 1;
      this.fetchUserList(val - 1);
      // console.log("handleNext");
    },
    fetchUserList(page) {
      // if (page === undefined) {
      //   page = 0;
      // }
      this.currentPage = page + 1;
      queryUser(this.queryForm, page)
        .then((res) => {
          this.list = res.data.content;
          this.total = res.data.total;
          // console.log(this.list);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    search() {
      this.fetchUserList(0);
    },
    refresh() {
      this.queryForm = {
        name: "",
        position: "",
      };
      console.log(this.currentPage);
      this.fetchUserList(this.currentPage - 1);
    },
    // 拉取用户信息
    refreshUser() {
      fetchAllUser().then(() => {
        this.$message({
          message: "拉取成功",
          type: "success",
        });
        this.fetchUserList(0);
      });
    },

    closeEdit() {
      this.dialog = false;
      this.$refs.permissionEdit.getPermission();
      this.$refs.permissionEdit.updateOptions();
      this.$refs.teamEdit.getTeams();
      this.$refs.teamEdit.updateOptions();
    },
  },
};
</script>
<style lang="scss" scoped>
.filtrate {
  padding-top: 10px;
}

.app-container {
  padding: 12px;
  background-color: #fafafa;
  border-radius: 0;
}
</style>
