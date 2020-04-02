<template>
  <div>
    <div>
      <!-- bug表格 -->
      <el-table :data="list" class="btable" :show-header="false">
        <el-table-column>
          <template slot-scope="scope">
            <p>
              <el-popover placement="bottom" title="标题" width="358" trigger="hover">
                <div>
                  <p>
                    {{ scope.row.description }}
                  </p>
                </div>
                <span slot="reference">
                  <span style="margin-right:10px">{{
                    scope.row.project.title
                  }}</span>
                  <span>{{ scope.row.title }}</span>
                </span>
              </el-popover>
            </p>

            <p>
              <span>提交与 {{ scope.row.insertTime | formatDate }}</span>
              <span style="margin: 0 8px">
                状态：
                <el-tag v-if="scope.row.status == undefined"> 待确认</el-tag>
                <el-tag v-else-if="scope.row.status">bug成立</el-tag>
                <el-tag v-else>bug不成立</el-tag>
              </span>
              <span v-if="scope.row.status">
                bug责任人：
                <el-tag effect="plain" v-for="(item, index) in scope.row.bugDetails" :key="index" style="margin:0 8px">{{ item.user.name }} AC: {{ item.ac }}</el-tag>
              </span>
            </p>
          </template>
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
import { listUserBug } from "@/api/bug.js";
export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    this.fetchUserBug();
  },
  methods: {
    fetchUserBug() {
      listUserBug().then(res => {
        this.list = res.data;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.btable {
  border-top: 0.5px solid #f0f0f0;
}
.content {
  padding: 0 20px;
}

label {
  color: #72767b;
}
</style>
