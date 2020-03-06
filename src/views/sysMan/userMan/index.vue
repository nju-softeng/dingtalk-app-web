<template>
  <div class="app-container">
    <el-tooltip class="item" effect="dark" content="用户进入应用时会自动导入，权限默认为普通用户" placement="right">
      <el-button type="primary">拉取钉钉用户</el-button>
    </el-tooltip>

    <span style="padding-left:100px;color: #999999; font-size:13px">当前审核人:</span>
    <el-tag effect="plain" style="margin:0 5px" v-for="(item, index) in auditors" :key="index">
      {{ item.name }}
    </el-tag>
    <el-tag effect="plain" style="margin:0 5px" v-if="auditors.length == 0">
      未设置
    </el-tag>

    <div style="width:800px">
      <el-table :data="list" style="margin-top:10px;" border>
        <el-table-column align="center" label="姓名">
          <template slot-scope="scope">
            <div style="display:flex;padding-left:10px">
              <el-avatar :size="28" style="background-color: #409eff">{{
                scope.row.name
              }}</el-avatar>
              <div style="padding-left:10px;text-align: center;">
                <span>{{ scope.row.name }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="职位">
          <template slot-scope="scope">
            {{ scope.row.position }}
            <span v-if="scope.row.position == undefined">未设置</span>
          </template>
        </el-table-column>
        <el-table-column prop="role" align="center" label="审核人权限">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.authority" active-text="审核权限" @change="modRole(scope.row)" :active-value="1" :inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="操作">
          <template slot-scope="scope">
            <el-popover placement="top" title="后端正在修改中" width="200" trigger="click" v-model="scope.row.visible">
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="scope.row.visible = false">确定</el-button>
              </div>
              <el-button type="primary" slot="reference">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { listUserRole, updateUserRole } from "@/api/user";
import { listAuditors } from "@/api/user";
export default {
  data() {
    return {
      auditors: [],
      list: []
    };
  },
  created() {
    listUserRole().then(res => {
      this.list = res.data;
    });
    listAuditors().then(res => {
      this.auditors = res.data.auditorlist;
    });
  },
  methods: {
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
    }
  }
};
</script>
