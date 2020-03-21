<template>
  <div class="app-container">
    <div>
      <el-table :data="list" :show-header="false">
        <el-table-column>
          <template slot-scope="scope">
            <p>
              <el-popover placement="top-start" title="标题" width="358" trigger="hover">
                <div>
                  <p>{{ scope.row.description }}</p>
                </div>
                <span slot="reference">
                  {{ scope.row.title }}
                </span>
              </el-popover>
            </p>

            <p>
              <span>提交与 {{ scope.row.insertTime | formatDate }}</span>
              <span style="padding-left:8px">
                状态： <el-tag> 待确认</el-tag>
              </span>
              <span>
                bug责任人：
                <el-tag style="margin:0 8px"> 花花</el-tag>
                <el-tag> 花花</el-tag>
                <el-tag> 花花</el-tag>
              </span>
            </p>
          </template>
        </el-table-column>

        <el-table-column label="tttt" fixed="right" width="60px">
          <el-button type="text" size="small" icon="el-icon-edit"> </el-button>
          <el-button type="text" size="small" icon="el-icon-delete">
          </el-button>
        </el-table-column>

        <template slot="empty">
          <div style="height:200px;">
            <div style="margin-top:100px;">
              <svg-icon icon-class="null" style="font-size:32px" /> <br />
            </div>
            <div style="line-height: 10px;">
              <span>没有bug记录</span>
            </div>
          </div>
        </template>
      </el-table>
    </div>
  </div>
</template>
<script>
import { listAuditorBug } from "@/api/bug.js";

export default {
  data() {
    return {
      uid: "",
      list: []
    };
  },
  create() {
    this.uid = sessionStorage.getItem("uid");
    listAuditorBug(this.uid).then(res => {
      console.log("????");
      this.list = res.data;
      console.list(res.data);
    });
  },
  methods: {
    submit() {}
  }
};
</script>
