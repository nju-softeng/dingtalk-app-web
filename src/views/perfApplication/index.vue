<template>
  <div class="app-container">
    <!-- 周绩效申请 drawer -->
    <el-drawer title="绩效申请" :visible.sync="drawer" :modal="false" :direction="direction" @closed="emptyForm" size="380px">
      <div class="drawer-content">
        <!-- dc表单 -->
        <el-form :model="form" label-width="90px" :rules="rules" ref="form" label-position="left">
          <el-form-item prop="auditorid">
            <span slot="label">
              <svg-icon icon-class="people" /> 审核人</span>
            <el-select style="width:210px" v-model="form.auditorid" placeholder="请选择审核人">
              <el-option v-for="(item, index) in auditors" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="dvalue">
            <span slot="label">
              <svg-icon icon-class="dvalue" /> D值</span>
            <el-input v-model="form.dvalue" style="width:210px"></el-input>
          </el-form-item>
          <el-form-item prop="date">
            <span slot="label">
              <svg-icon icon-class="week" /> 申请周</span>
            <el-date-picker v-show="!form.date" v-model="form.date" style="width:210px" type="week" value-format="yyyy-MM-dd" format="yyyy 第 WW 周" placeholder="选择周" :picker-options="{ firstDayOfWeek: 1 }" @change="getDate"></el-date-picker>
            <el-tag v-show="form.date" closable @close="closeTag" effect="plain" size="medium" style="font-size:12px;">
              {{ monthWeek }}
            </el-tag>
          </el-form-item>
        </el-form>
        <!-- ac申请 -->
        <div>
          <div :label="index === 0 ? 'AC值' : ''" v-for="(item, index) in form.acItems" :key="index" style="margin : 5px 0px 5px 0px;display:flex">
            <el-input v-model="item.reason" style="margin-right:3px;" placeholder="申请原因"></el-input>
            <el-input v-model="item.ac" style="width:20%" placeholder="AC"></el-input>

            <el-button style="border: 0px" icon="el-icon-delete" @click.prevent="rmAcItem(item)" />
          </div>
          <el-button @click="addAcItem" style="border-style:dashed; width:298px; "><i class="el-icon-plus"></i> 添加AC申请</el-button>

          <br />
        </div>
      </div>

      <div class="drawer-footer">
        <el-button style="width:50%" @click="drawer = false">取 消</el-button>
        <el-button style="width:50%" type="primary" @click="submit()" :loading="loading">{{ loading ? "提交中 ..." : "确 定" }}</el-button>
      </div>
    </el-drawer>
    <!-- 申请按钮 -->
    <el-button type="primary" @click="addApply()" icon="el-icon-plus" style="margin : 0px 0px 10px 0px;">提交申请</el-button>
    <!-- 已提的交申请 -->
    <div style="height:430px">
      <el-table :data="list" fit highlight-current-row style="width: 100%">
        <el-table-column width="30px" label="#" type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item label="AC申请：">
                <span v-if="props.row.acItems.length == 0"> 无 </span>
                <div v-else>
                  <li v-for="(item, index) in props.row.acItems" :key="index">
                    申请值: {{ item.ac }} / 申请理由：{{ item.reason }}
                  </li>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column width="140px" align="center" label="提交日期">
          <template slot-scope="{ row }">
            <span>{{ row.insertTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
          </template>
        </el-table-column>

        <el-table-column width="140px" align="center" label="报表月周">
          <template slot-scope="{ row }">
            <span>{{ row.yearmonth | formatWeek(row.week) }}</span>
          </template>
        </el-table-column>

        <el-table-column width="90px" align="center" label="审核人">
          <template slot-scope="{ row }">
            <span>{{ row.auditor.name }}</span>
          </template>
        </el-table-column>

        <el-table-column width="80px" label="D值">
          <template slot-scope="{ row }">
            <span>{{ row.dvalue }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="200px" label="审核结果">
          <template slot-scope="{ row }">
            <template v-if="row.status">
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
            <el-button v-if="!row.status" type="text" size="mini" icon="el-icon-edit" @click="addModify(row)">修改</el-button>
            <el-tag v-else type="info">已审核</el-tag>
            <!-- <el-button v-else type="primary" size="small" icon="el-icon-edit" @click="drawer = true">重新申请</el-button> -->
          </template>
        </el-table-column>
        <template slot="empty">
          <div style="height:300px;">
            <div style="margin-top:100px;">
              <svg-icon icon-class="null" style="font-size:32px" /> <br />
            </div>
            <div style="line-height: 10px;">
              <span>没有已申请内容</span>
            </div>
          </div>
        </template>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="text-align:center">
      <el-pagination @prev-click="handlePrev" @next-click="handleNext" @current-change="handleCurrentChange" background :hide-on-single-page="total > 10" small layout="prev, pager, next" :total="total" :page-size="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { listAuditors } from "@/api/user";
import {
  submitApplication,
  updateApplication,
  getUserApplication,
  getWeek
} from "@/api/application";
export default {
  data: () => ({
    apply: null,
    uid: "11",
    direction: "ltr",
    drawer: false,
    monthWeek: "请选择报表申请所在在周",
    auditors: [],
    loading: false,
    form: {
      id: null,
      auditorid: null,
      date: "",
      dvalue: "",
      acItems: []
    },
    list: null,
    total: null,
    rules: {
      auditorid: [
        { required: true, message: "请选择审核人", trigger: "change" }
      ],
      dvalue: [{ required: true, message: "请输入D值", trigger: "blur" }],
      "acItems.reason": [
        { required: true, message: "请填写AC申请", trigger: "blur" }
      ],
      date: [{ required: true, message: "请选择绩效所在周", trigger: "change" }]
    }
  }),
  created() {
    listAuditors()
      .then(res => {
        this.auditors = res.data.auditorlist;
        console.log(this.auditors);
      })
      .then(() => {
        getUserApplication(0).then(res => {
          this.list = res.data.list;
          this.total = res.data.total;
          console.log(this.list);
        });
      });
  },
  computed: {},
  methods: {
    // 清空表单
    emptyForm() {
      this.$refs["form"].resetFields();
      this.form.acItems = [];
    },
    // 分页获取数据
    handleCurrentChange(val) {
      getUserApplication(val - 1).then(res => {
        this.list = res.data.list;
      });
    },
    // 上一页
    handlePrev(val) {
      getUserApplication(val - 1).then(res => {
        this.list = res.data.list;
      });
    },
    // 下一页
    handleNext(val) {
      getUserApplication(val - 1).then(res => {
        this.list = res.data.list;
      });
    },
    // 点击添加后调用
    addApply() {
      this.apply = true;
      this.direction = "ltr";
      this.drawer = true;
    },
    // 点击修改后调用
    addModify(row) {
      this.apply = false;
      this.direction = "rtl";
      this.drawer = true;
      this.$nextTick(() => {
        this.form.id = row.id;
        this.form.acItems = row.acItems;
        this.form.dvalue = row.dvalue;
        this.form.auditorid = row.auditor.id;
        this.form.date = row.weekdate;
        this.form.acItems = row.acItems;
        this.monthWeek =
          row.yearmonth.toString().slice(4, 7) + " 月 第 " + row.week + " 周";
      });
    },
    // 修改时间选择器的日期
    getDate() {
      let date = new Date(this.form.date);
      this.form.date = new Date(date.setDate(date.getDate() + 2));
      getWeek(this.form.date).then(res => {
        let yearmonth = res.data[0];
        let week = res.data[1];
        this.monthWeek =
          yearmonth.toString().slice(4, 7) + " 月 第 " + week + " 周";
      });
    },
    closeTag() {
      this.form.date = "";
    },
    // 提交申请
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 过滤 acItems 中为空的选项
          this.form.acItems = this.form.acItems.filter(item => item.ac != null);
          this.loading = true;
          if (this.apply) {
            submitApplication(this.form)
              .then(() => {
                getUserApplication(0).then(res => {
                  this.list = res.data.list;
                  this.total = res.data.total;
                });
                this.loading = false;
                this.$notify({
                  title: "成功",
                  message: "申请提交成功",
                  type: "success"
                });
                this.drawer = false;
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            updateApplication(this.form)
              .then(() => {
                getUserApplication(0).then(res => {
                  this.list = res.data.list;
                  this.total = res.data.total;
                });
                this.loading = false;
                this.$notify({
                  title: "成功",
                  message: "修改提交成功",
                  type: "success"
                });
              })
              .catch(() => {
                this.loading = false;
              });
          }
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
      this.form.acItems.push({
        ac: null,
        reason: null
      });
    },
    // 删除ac申请项
    rmAcItem(item) {
      const index = this.form.acItems.indexOf(item);
      if (index !== -1) {
        this.form.acItems.splice(index, 1);
      }
    }
  }
};
</script>

<style scope>
.el-drawer > header > span:focus {
  outline-color: white;
}
.el-drawer > header > button:focus {
  outline-color: white;
}
.el-drawer > header > button:hover {
  color: rgb(64, 158, 255);
}
.el-drawer__body {
  padding: 20px;
  flex-direction: column;
  display: flex;

  overflow-y: auto;
  /* background-color: chartreuse; */
}

.drawer-content {
  display: flex;
  flex-direction: column;
  /* background-color: yellow; */
  flex-grow: 2;
}

.drawer-footer {
  /* background-color: beige; */
  margin: 5px 0;
  display: flex;
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
