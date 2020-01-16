<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form label-width="60px" label-position="left">
        <el-form-item label="审核人:">
          <el-select v-model="application.dcRecord.auditor.id" placeholder="请选择">
            <el-option
              v-for="item in auditors"
              :key="item.index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="D值:">
          <el-input v-model="application.dcRecord.dvalue" placeholder="请输入贡献值" style="width:200px"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item
          :label="index === 0 ? 'AC值' : ''"
          v-for="(item, index) in application.acItems"
          :key="index"
        >
          <el-input
            v-model="item.reason"
            placeholder="申请原因"
            style="width:450px; margin : 0px 5px 0px 0px;"
          ></el-input>
          <el-input
            v-model="item.ac"
            placeholder="AC值"
            style="width:100px;margin : 0px 5px 0px 0px;"
          ></el-input>
          <el-button type="text" icon="el-icon-close" @click.prevent="rmAcItem(item)" />
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="addAcItem">
            <i class="el-icon-plus"></i>
            添加AC申请
          </el-button>
        </el-form-item>
        <el-col :offset="12">
          <el-button type="primary" style="margin : 0px 0px 5px 0px;">提交</el-button>
        </el-col>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getAuditors } from "@/api/user";
//import { submitApplication } from "@/api/application";
export default {
  data: () => ({
    report: "test",
    auditors: [],
    application: {
      date: "2020-01-26",
      dcRecord: {
        auditor: {
          id: 2
        },
        dvalue: 2
      },
      acItems: [
        {
          reason: null,
          ac: null
        },
        {
          reason: null,
          ac: null
        }
      ]
    }
  }),
  created() {
    getAuditors().then(res => {
      this.auditors = res.data.auditorlist;
    });
  },
  methods: {
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
    // 添加一个ac申请项
    addAcItem() {
      this.application.acItems.push({
        ac: null,
        reason: null
      });
    },
    // 删除ac申请项
    rmAcItem(item) {
      const index = this.application.acItems.indexOf(item);
      if (index !== -1) {
        this.application.acItems.splice(index, 1);
      }
    }
  }
};
</script>

<style>
.el-form-item__label {
  font-weight: normal;
  font-size: 14px;
}

.box-card {
  width: 100%;
}
</style>
