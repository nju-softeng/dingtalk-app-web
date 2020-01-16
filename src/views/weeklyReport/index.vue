<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form label-width="60px" label-position="left">
        <el-form-item label="审核人:">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in auditors"
              :key="item.index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="D值:">
          <el-input v-model="input" placeholder="请输入内容" style="width:200px"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="AC值:">
          <el-row :gutter="3">
            <el-col :span="8">
              <el-input v-model="input" placeholder="申请原因"></el-input>
            </el-col>
            <el-col :span="3">
              <el-input v-model="input" placeholder="AC值"></el-input>
            </el-col>
            <el-col :span="3">
              <el-button icon="el-icon-close" type="text" @click.prevent="removeOptions(item)" />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getAuditors, getReport } from "@/api/user";
//import { submitApplication } from "@/api/application";
export default {
  data: () => ({
    report: "test",
    auditors: [],
    application: {}
  }),
  created() {
    getAuditors().then(res => {
      this.auditors = res.data.auditorlist;
    });
    getReport().then(res => {
      console.log(res.data);
      for (const item of res.data.contents) {
        this.report += item["key"] + ":\n" + item["value"] + "\n";
      }
    });
  },
  methods: {
    formatTooltip(val) {
      return val / 100;
    }
    // submit(formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       console.log("submit");
    //       alert("submit!");
    //       // 过滤 acItems 中为空的选项
    //       this.application.acItems = this.application.acItems.filter(
    //         item => item != null
    //       );
    //       submitApplication(this.application);
    //     } else {
    //       alert("no submit!");
    //     }
    //   });
    // },
    // // 添加一个ac申请项
    // addAcItem() {
    //   this.application.acItems.push({
    //     ac: null,
    //     reason: null
    //   });
    // },
    // // 删除ac申请项
    // rmAcItem(item) {
    //   const index = this.application.acItems.indexOf(item);
    //   if (index !== -1) {
    //     this.application.acItems.splice(index, 1);
    //   }
    // }
  }
};
</script>

<style>
.el-form-item__label {
  font-weight: normal;
  font-size: 14px;
}

.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 100%;
}
</style>
