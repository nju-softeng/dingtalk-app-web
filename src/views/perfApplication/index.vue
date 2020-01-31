<template>
  <div class="app-container">
    <el-drawer title="我是标题" :visible.sync="drawer" :modal="false" size="40%" :with-header="false">
      <span>我来啦!</span>
    </el-drawer>

    <el-card class="box-card" v-show="showApplication">
      <el-form label-width="70px" label-position="left" :rules="rules" :model="application" ref="form">
        <el-row>
          <el-col :span="8">
            <el-form-item label="审核人:" prop="dcRecord.auditor.id">
              <el-select v-model="application.dcRecord.auditor.id" placeholder="请选择">
                <el-option v-for="item in auditors" :key="item.index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="D值:" prop="dcRecord.dvalue">
              <el-input v-model="application.dcRecord.dvalue" placeholder="请输入贡献值" style="width:193px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-tag style="width:220px; font-size:14px">
                {{ monthWeek }}
              </el-tag>
            </el-form-item>
            <el-form-item label="报表周:" prop="date">
              <el-date-picker v-model="application.date" type="week" format="yyyy 第 WW 周" placeholder="选择周" :picker-options="{ firstDayOfWeek: 1 }" @change="getDate"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button type="text" @click="addAcItem">
          <i class="el-icon-plus"></i>
          添加AC申请
        </el-button>
        <div :label="index === 0 ? 'AC值' : ''" v-for="(item, index) in application.acItems" :key="index" style="margin : 5px 0px 5px 0px;">
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
        <el-col :offset="5">
          <el-button type="primary" @click="submit()" style="margin : 0px 0px 10px 0px;">提交</el-button>
          <el-button @click="showApplication = !showApplication">取 消</el-button>
        </el-col>
      </el-form>
    </el-card>

    <el-button type="primary" @click="showApplication = !showApplication" style="margin : 0px 0px 10px 0px;" v-show="!showApplication">提交申请</el-button>

    <div style="height:480px">
      <el-table :data="dcRecordList" border fit highlight-current-row style="width: 100%">
        <el-table-column width="180px" align="center" label="提交日期">
          <template slot-scope="{ row }">
            <span>{{ row.insertTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
          </template>
        </el-table-column>

        <el-table-column width="140px" align="center" label="报表月周">
          <template slot-scope="{ row }">
            <span>{{ reportTime(row.yearmonth, row.week) }}</span>
          </template>
        </el-table-column>

        <el-table-column width="120px" align="center" label="审核人">
          <template slot-scope="{ row }">
            <span>{{ obj[row.auditor.id] }}</span>
          </template>
        </el-table-column>

        <el-table-column width="100px" label="D值">
          <template slot-scope="{ row }">
            <span>{{ row.dvalue }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="200px" label="审核结果">
          <template slot-scope="{ row }">
            <template v-if="row.ischeck">
              <el-tag style="margin-right:5px">C值: {{ row.cvalue }}</el-tag>
              <el-tag style="margin-right:5px">DC值: {{ row.dc }}</el-tag>
              <el-tag>AC值: {{ row.ac }}</el-tag>
            </template>
            <template v-else>
              <el-tag type="warning">待审核</el-tag>
            </template>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button v-if="!row.ischeck" type="danger" size="small" icon="el-icon-edit" @click="drawer = true">修改申请</el-button>
            <el-button v-else type="primary" size="small" icon="el-icon-edit" @click="drawer = true">重新申请</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align:center">
      <el-pagination :page-size="10" :total="amount" layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { getAuditors } from "@/api/user";
import {
  submitApplication,
  getUserApplication,
  getWeek
} from "@/api/application";
export default {
  data: () => ({
    direction: "ttb",
    drawer: false,
    showApplication: false,
    monthWeek: "请选择报表申请所在在周",
    auditors: [],
    application: {
      date: null,
      dcRecord: {
        auditor: {
          id: null
        },
        dvalue: null,
        yearmonth: 111,
        week: null
      },
      acItems: [
        {
          reason: null,
          ac: null
        }
      ]
    },
    obj: {},
    dcRecordList: null,
    amount: null,
    rules: {
      "dcRecord.auditor.id": [
        { required: true, message: "请选择审核人", trigger: "change" }
      ],
      "dcRecord.dvalue": [
        { required: true, message: "请输入D值", trigger: "blur" }
      ],
      "dcRecord.acItems.reason": [
        { required: true, message: "请填写AC申请", trigger: "blur" }
      ],
      date: [{ required: true, message: "请选择绩效所在周", trigger: "change" }]
    }
  }),
  computed: {
    reportTime() {
      return (yearmonth, week) => {
        return yearmonth.toString().slice(4, 7) + " 月 第 " + week + " 周";
      };
    }
  },
  created() {
    getAuditors()
      .then(res => {
        this.auditors = res.data.auditorlist;
        console.log(this.auditors);
        this.auditors.map(item => {
          this.obj[item.id] = item.name; //todo 修改
        });
      })
      .then(() => {
        getUserApplication(0, 0).then(res => {
          console.log(res.data.dcRecords);
          this.dcRecordList = res.data.dcRecords;
          this.amount = res.data.amount;
        });
      });
  },
  methods: {
    getDate() {
      getWeek({ time: this.application.date }).then(res => {
        let yearmonth = res.data.yearmonth.toString();
        let week = res.data.week;
        this.monthWeek =
          yearmonth.slice(0, 4) +
          " 年 " +
          yearmonth.slice(4, 7) +
          " 月 第 " +
          week +
          " 周";
      });
    },
    // 分页获取数据
    handleCurrentChange(val) {
      getUserApplication(0, val).then(res => {
        this.dcRecordList = res.data.dcRecords;
      });
    },
    // 提交申请
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 过滤 acItems 中为空的选项
          this.application.acItems = this.application.acItems.filter(
            item => item.ac != null
          );
          submitApplication(this.application).then(() => {
            this.$notify({
              title: "成功",
              message: "申请提交成功",
              type: "success"
            });
            getUserApplication(0, 0).then(res => {
              this.dcRecordList = res.data.dcRecords;
              this.amount = res.data.amount;
            });
          });
        } else {
          this.$notify({
            title: "提交失败",
            message: "请填充必要信息",
            type: "warning"
          });
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
.el-table td {
  padding: 4px 0px;
}
.el-table tr {
  height: 10px;
}
.el-form-item__label {
  font-weight: normal;
  font-size: 14px;
}

.box-card {
  width: 100%;
  margin-bottom: 10px;
}
</style>
