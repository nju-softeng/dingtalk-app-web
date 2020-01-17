<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form
        label-width="70px"
        label-position="left"
        :rules="rules"
        :model="application"
        ref="form"
      >
        <el-form-item label="审核人:" prop="dcRecord.auditor.id">
          <el-select v-model="application.dcRecord.auditor.id" placeholder="请选择">
            <el-option
              v-for="item in auditors"
              :key="item.index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="D值:" prop="dcRecord.dvalue">
          <el-input v-model="application.dcRecord.dvalue" placeholder="请输入贡献值" style="width:200px"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-button type="text" @click="addAcItem">
          <i class="el-icon-plus"></i>
          添加AC申请
        </el-button>
        <div
          :label="index === 0 ? 'AC值' : ''"
          v-for="(item, index) in application.acItems"
          :key="index"
          style="margin : 5px 0px 5px 0px;"
        >
          <el-row :gutter="2">
            <el-col :span="6">
              <el-input v-model="item.reason" placeholder="申请原因"></el-input>
            </el-col>
            <el-col :span="2">
              <el-input v-model="item.ac" placeholder="AC值"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button style="border: 0px" icon="el-icon-close" @click.prevent="rmAcItem(item)" />
            </el-col>
          </el-row>
        </div>
        <br />
        <el-col :offset="7">
          <el-button type="primary" @click="submit()" style="margin : 0px 0px 5px 0px;">提交</el-button>
        </el-col>
      </el-form>
    </el-card>
    <br />
    <el-table :data="dcRecordList" border fit highlight-current-row style="width: 100%">
      <el-table-column width="180px" align="center" label="提交日期">
        <template slot-scope="{ row }">
          <span>{{ row.insertTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="报表月周">
        <template slot-scope="{ row }">
          <span>{{ row.auditor }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="审核人">
        <template slot-scope="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="D值">
        <template slot-scope="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="AC值">
        <template slot-scope="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="审核结果" width="110">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">{{ row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="Title">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >cancel</el-button>
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >Ok</el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit = !row.edit"
          >Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAuditors } from "@/api/user";
import { getUserApplication } from "@/api/application";
export default {
  data: () => ({
    report: "test",
    auditors: [],
    application: {
      date: "2020-01-26",
      dcRecord: {
        auditor: {
          id: null
        },
        dvalue: null
      },
      acItems: [
        {
          reason: null,
          ac: null
        }
      ]
    },
    rules: {
      "dcRecord.auditor.id": [
        { required: true, message: "请选择审核人", trigger: "change" }
      ],
      "dcRecord.dvalue": [
        { required: true, message: "请输入D值", trigger: "blur" }
      ],
      "dcRecord.acItems.reason": [
        { required: true, message: "请填写AC申请", trigger: "blur" }
      ]
    },
    dcRecordList: null
  }),
  created() {
    getAuditors().then(res => {
      this.auditors = res.data.auditorlist;
    });
    getUserApplication(0, 0).then(res => {
      console.log(res.data.dcRecords);
      this.dcRecordList = res.data.dcRecords;
    });
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log("submit");
          alert("submit!");
          // 过滤 acItems 中为空的选项
          this.application.acItems = this.application.acItems.filter(
            item => item != null
          );
          //submitApplication(this.application);
        } else {
          alert("no submit!");
        }
      });
    },
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
