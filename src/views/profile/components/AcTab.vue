<template>
  <div class="block">
    <template v-if="list.length == 0">
      <div style="height:200px;text-align:center;padding-top:70px;">
        <svg-icon icon-class="null" style="font-size:32px" />
      </div>
    </template>
    <el-timeline>
      <el-timeline-item v-for="(item, index) of list" :key="index" :timestamp="item.create_time" placement="top">
        <el-card shadow="never">
          <p>{{ item.reason }}</p>
          <p>
            <span v-if="item.ac > 0" style="padding-right:20px">AC值变化：+ {{ item.ac }}</span>
            <span v-else style="padding-right:20px">AC值变化： {{ item.ac }}</span>
            <span v-if="item.classify == 0" style="padding-right:20px">审核人: {{ item.auditor }}</span>
            <el-tag>{{ getClassify(item.classify) }}</el-tag>
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { listUserAc } from "@/api/performance";
export default {
  data() {
    return {
      list: []
    };
  },
  computed: {
    getClassify() {
      return val => {
        if (val == 0) return "周报申请";
        else if (val == 1) return "项目AC";
        else if (val == 2) return "论文AC";
        else return "投票AC";
      };
    }
  },
  created() {
    let uid = sessionStorage.getItem("uid");
    listUserAc(uid).then(res => {
      this.list = res.data;
    });
  }
};
</script>

<style lang="scss" scoped>
.block /deep/ .el-card__body {
  padding: 0px 20px 5px;
}
</style>
