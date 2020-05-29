<template>
  <div>
    <el-card class="box-card" style="width:50%">
      <div slot="header">
        <span>绩效标准</span>
        <el-button v-if="flag1" @click="flag1 = false" style="float: right; padding: 3px 0" type="text">编辑</el-button>
        <el-button v-else @click="
            flag1 = true;
            modifySubsidy();
          " style="float: right; padding: 3px 0" type="text">保存</el-button>
      </div>

      <el-table :data="subsidylist" style="width: 100%">
        <el-table-column label="在读学位" prop="position"></el-table-column>
        <el-table-column label="绩效标准" align="center">
          <template slot-scope="{ row }">
            <span v-if="flag1"> {{ row.subsidy }} </span>
            <el-input v-else v-model="row.subsidy" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- <el-divider><span>绩效标准</span></el-divider> -->
  </div>
</template>
<script>
import { listSubsidy, updateSubsidy } from "@/api/system";
export default {
  data() {
    return {
      flag1: true,
      subsidylist: []
    };
  },
  created() {
    this.fetchSubsidy();
  },
  methods: {
    // 获取所有绩效标准
    fetchSubsidy() {
      listSubsidy().then(res => {
        console.log(res);
        this.subsidylist = res.data;
      });
    },

    //更新绩效标准
    modifySubsidy() {
      updateSubsidy(this.subsidylist).then(() => {
        this.$notify({
          title: "成功",
          message: "绩效标准保存成功",
          position: "bottom-right",
          type: "success"
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.box-card {
  /deep/ .el-card__body {
    padding: 5px 20px 10px;
    font-size: 14px;
  }
}
</style>
