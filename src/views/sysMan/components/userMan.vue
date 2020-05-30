<template>
  <div>
    <div>
      <el-tooltip class="item" effect="dark" content="用户进入应用时会自动导入，权限默认为普通用户" placement="right">
        <el-button @click="refreshUser" type="primary">拉取钉钉用户</el-button>
      </el-tooltip>
      <span style="padding-left:100px;color: #999999; font-size:13px">当前审核人:</span>
      <el-tag effect="plain" style="margin:0 5px" v-for="(item, index) in auditors" :key="index">
        {{ item.name }}
      </el-tag>
      <el-tag effect="plain" style="margin:0 5px" v-if="auditors.length == 0">
        未设置
      </el-tag>
      <!-- <div style="float:right;color:#8c8c8c;font-size:14px;margin-right:16px">
        系统可用人数：{{ total }}
      </div> -->
    </div>
    <el-divider></el-divider>
    <div class="filtrate">
      <el-input @change="search" placeholder="姓名" v-model="queryForm.name" style="width:160px" clearable>
      </el-input>
      <el-select style="margin-left:5px; width:160px" v-model="queryForm.position" clearable placeholder="在读学历">
        <el-option v-for="(item, index) in options" :key="index" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-button @click="search" style="margin-left:5px" size="mini" icon="el-icon-search">搜索</el-button>
      <el-button @click="refresh" size="mini" icon="el-icon-refresh-right" style="margin-left:5px">
        重置
      </el-button>
      <!-- <el-radio-group v-model="radio" style="float:right; margin:0 20px" size="mini">
        <el-radio-button label="可用用户"></el-radio-button>
        <el-radio-button label="已禁用"></el-radio-button>
      </el-radio-group> -->
    </div>

    <div>
      <el-table :data="list" style="margin-top:10px;">
        <el-table-column label="学号" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.stuNum == undefined">未设置</span>
            <span>{{ scope.row.stuNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="在读学位">
          <template slot-scope="scope">
            {{ scope.row.position }}
            <span v-if="scope.row.position == undefined">未设置</span>
          </template>
        </el-table-column>
        <el-table-column prop="role" align="center" label="权限">
          <template slot-scope="{ row }">
            <el-tag v-if="row.authority == 0" type="info">普通用户</el-tag>
            <el-tag v-else type="success">评审人</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" style="padding-right:8px">编辑</el-button>
            <el-popover placement="top" title="后端正在修改中" width="200" trigger="click" v-model="scope.row.visible">
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="scope.row.visible = false">确定</el-button>
              </div>
              <el-button type="text" slot="reference">停用</el-button>
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

      <div style="margin-top:5px;display:flex; justify-content:center">
        <el-pagination @prev-click="handlePrev" @next-click="handleNext" @current-change="handleCurrentChange" :hide-on-single-page="total < 10 ? true : false" small background layout="prev, pager, next" :total="total" :page-size="10">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { updateUserRole } from "@/api/user";
import { queryUser, fetchAllUser } from "@/api/system";
import { listAuditors } from "@/api/user";
export default {
  data() {
    return {
      total: 0,
      auditors: [],
      list: [],
      queryForm: {
        name: "",
        position: ""
      },
      page: null,
      options: ["本科生", "硕士生", "博士生", "待定"]
    };
  },
  created() {
    this.fetchUserList(0);
    listAuditors().then(res => {
      this.auditors = res.data.auditorlist;
    });
  },
  methods: {
    // 分页获取数据
    handleCurrentChange(val) {
      this.fetchUserList(val - 1);
    },
    handlePrev(val) {
      this.fetchUserList(val - 1);
    },
    handleNext(val) {
      this.fetchUserList(val - 1);
    },
    fetchUserList(page) {
      if (page == undefined) {
        page = 0;
      }
      queryUser(this.queryForm, page).then(res => {
        console.log(res.data);
        this.list = res.data.content;
        this.total = res.data.total;
        console.log(this.list);
      });
    },
    modRole(row) {
      updateUserRole({
        uid: row.id,
        authority: row.authority
      })
        .then(() => {
          listAuditors().then(res => {
            this.auditors = res.data.auditorlist;
          });
          this.$message({
            showClose: true,
            message: "审核人设置成功",
            type: "success"
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "设置失败",
            type: "error"
          });
        });
      console.log(row);
    },
    search() {
      this.fetchUserList(0);
    },
    refresh() {
      this.queryForm = {
        name: "",
        position: ""
      };
      this.fetchUserList(0);
    },
    // 拉取用户信息
    refreshUser() {
      fetchAllUser().then(() => {
        this.$message({
          message: "拉取成功",
          type: "success"
        });
        this.fetchUserList(0);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.filtrate {
  padding-top: 10px;
}
</style>
