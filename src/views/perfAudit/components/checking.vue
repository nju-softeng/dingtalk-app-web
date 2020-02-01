<template>
  <div class="checking">
    <el-drawer :visible.sync="drawer" :modal="false" :with-header="false" size="55%">
      <div v-if="list.length !== 0 && show" ref="drawer" class="drawer-container" v-loading="loading">
        <div class="drawer-bar">
          <span>{{ temp.name }} 的申请</span>
          <el-tag style="margin-left:10px">
            {{ showDate(temp.yearmonth, temp.week) }}
          </el-tag>
        </div>

        <el-card class="report-card">
          <div v-for="(item, index) in report" :key="index" class="item">
            <li>{{ item.key }}</li>
            <p>{{ item.value }}</p>
          </div>
        </el-card>

        <el-card class="ac-card">
          <el-table :data="form.acItems" tooltip-effect="dark">
            <el-table-column label="AC申请理由" width="300">
              <template slot-scope="{ row }">
                <span :class="{ text_span: !row.status }">
                  {{ row.reason }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="AC" align="center" width="120">
              <template slot-scope="{ row }">
                <template v-if="row.edit">
                  <el-input v-model="row.ac" type="number" style="width:50px" />
                </template>
                <span :class="{ text_span: !row.status }" v-else>{{
                  row.ac
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <template v-if="row.edit">
                  <el-button type="text" size="small" icon="el-icon-circle-check-outline" @click="confirmEdit(row)">保存</el-button>
                  <el-button type="text" size="small" @click="cancelEdit(row)">取消</el-button>
                </template>
                <template v-else>
                  <el-button type="text" :disabled="row.reject" size="small" icon="el-icon-edit" @click="row.edit = !row.edit">编辑
                  </el-button>
                  <el-button v-if="!row.reject" type="text" size="small" @click.native.prevent="rejectAcRow(row)">拒绝</el-button>
                  <el-button v-if="row.reject" type="text" size="small" @click.native.prevent="rejectAcRow(row)">恢复</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card class="form-card">
          <div style="margin:10px 0">
            <span style="margin-right:30px">D值：{{ temp.dvalue }}</span>
            <span style="margin-right:30px">AC值：{{ form.ac }}</span>
            <span>DC值：{{ form.dc }}</span>
          </div>
          <el-form label-position="left" label-width="60px" :model="form">
            <el-form-item label="C值">
              <el-input v-model="form.cvalue" style="width:80px" />
            </el-form-item>
          </el-form>

          <div>
            <el-button @click="submit()">确认提交</el-button>
            <el-button @click="prev()">上一个</el-button>
            <el-button @click="next()">下一个</el-button>
          </div>
        </el-card>
      </div>
    </el-drawer>
    <div>
      <el-table :data="list" style="width: 100%" :row-class-name="addTableIndex" @row-click="onRowClick">
        <el-table-column label="申请时间" width="150" align="center">
          <template slot-scope="{ row }">
            <span>
              {{ row.insertTime | parseTime("{y}-{m}-{d} {h}:{i}") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="申请周" width="100" align="center">
          <template slot-scope="{ row }">
            <span>
              {{ showDate(row.yearmonth, row.week) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center" width="100" />
        <el-table-column prop="dvalue" label="申请D值" align="center" width="80" />
        <el-table-column label="  AC申请">
          <template slot-scope="{ row }">
            <el-tag v-if="row.acItems.length === 0" style="margin:0px 5px">无</el-tag>
            <el-tag v-for="(item, index) in row.acItems" :key="index" style="margin:0px 5px">{{ item.reason }} : {{ item.ac }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
    {{ temp }}
  </div>
</template>
<script>
import { getAudit } from "@/api/application";
import { getReportList, submitAudit } from "@/api/audit";
export default {
  data() {
    return {
      drawer: false,
      loading: false,
      span_style: true,
      list: [],
      index: 0,
      show: true,
      reportList: null,
      report: null,
      form: {
        id: null,
        cvalue: null,
        dc: null,
        ac: null,
        acItems: []
      },
      temp: {
        id: "",
        cvalue: "",
        dc: "",
        ac: "",
        yearmonth: "",
        week: "",
        acItems: []
      }
    };
  },
  created() {
    getAudit().then(res => {
      this.list = res.data;
      console.log(this.list);
    });
    getReportList().then(res => {
      this.reportList = res.data;
    });
  },
  watch: {
    "form.cvalue"() {
      this.form.dc = this.form.cvalue * this.temp.dvalue;
    }
  },
  methods: {
    cancelEdit(row) {
      row.ac = row.originalAc;
      row.edit = false;
      this.$message({
        message: "The title has been restored to the AC value",
        type: "warning"
      });
    },
    confirmEdit(row) {
      row.edit = false;
      row.ac *= 1;
      row.originalAc = row.ac;
      this.form.ac = this.form.acItems
        .filter(item => item.status === true)
        .reduce((sum, item) => sum + item.ac, 0);
      this.$message({
        message: "The AC has been edited",
        type: "success"
      });
    },
    showDate(yearmonth, week) {
      return yearmonth.toString().slice(4, 7) + " 月 第 " + week + " 周";
    },
    addTableIndex({ row, rowIndex }) {
      row.index = rowIndex;
    },
    onRowClick(row) {
      this.drawer = !this.drawer; // 开启抽屉
      this.temp = JSON.parse(JSON.stringify(row));
      console.log(this.temp);
      this.index = row.index; // 指定当前列
      let _self = this;
      this.$options.methods.showDetail(_self);
    },
    rejectAcRow(row) {
      row.reject = !row.reject;
      row.status = !row.status;
      this.form.ac = this.form.acItems
        .filter(item => item.status === true)
        .reduce((sum, item) => sum + item.ac, 0);
    },

    showDetail(_self) {
      _self.form.id = _self.temp.id;
      _self.form.acItems = _self.temp.acItems.slice(0).map(v => {
        _self.$set(v, "edit", false);
        _self.$set(v, "reject", false);
        v.originalAc = v.ac;
        v.status = true;
        return v;
      });
      console.log(_self.form.acItems);
      _self.form.ac = _self.form.acItems
        .filter(item => item.status === true)
        .reduce((sum, item) => sum + item.ac, 0);
      _self.$nextTick(() => {
        setTimeout(() => {
          _self.$refs.drawer.scrollTop = 0;
        }, 100);
      });
      let value = _self.reportList.filter(item => {
        return item.uid == _self.temp.uid;
      });
      if (value instanceof Array) {
        _self.report = value[0].contents;
      } else {
        _self.report = value.contents;
      }
    },
    prev() {
      if (this.index !== 0) {
        this.loading = true;
        this.index--;
        let _self = this;
        setTimeout(() => (this.loading = false), 400);
        this.$options.methods.showDetail(_self);
      }
    },
    next() {
      if (this.index !== this.list.length - 1) {
        this.loading = true;
        this.index++;
        let _self = this;
        setTimeout(() => (this.loading = false), 400);
        this.$options.methods.showDetail(_self);
      }
    },
    submit() {
      submitAudit(this.form).then(() => {
        this.$notify({
          title: "成功",
          message: "提交成功",
          type: "success"
        });
      });
      this.loading = true;
      if (this.index !== this.list.length - 1) {
        this.list.splice(this.index, 1);
      } else {
        this.show = false;
        this.list.splice(this.index, 1);
        this.index--;
        this.show = true;
      }
      setTimeout(() => (this.loading = false), 500);
    }
  }
};
</script>

<style scoped>
.ac-card >>> input[type="number"] {
  -moz-appearance: textfield;
}
.ac-card >>> input[type="number"]::-webkit-inner-spin-button,
.ac-card >>> input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.text_span {
  text-decoration: line-through;
  color: #d9d9d9;
}

::-webkit-scrollbar {
  width: 0px;
}

.checking >>> .el-drawer__body {
  height: 0;
}

.checking >>> .el-card__body {
  padding: 5px 20px;
}

.drawer-container {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
}

.drawer-bar {
  z-index: 9;
  display: flex; /*Flex布局*/
  align-items: center; /*指定垂直居中*/
  padding: 0px 20px;
  width: 100%;
  height: 50px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  position: fixed;
  background-color: white;
}

p {
  word-wrap: break-word;
}

.item {
  padding: 4px 0;
}

.report-card {
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 50px;
  font-size: 13px;
  width: 100%;
}

.ac-card {
  padding-bottom: 5px;
  font-size: 13px;
  width: 100%;
}

.form-card {
  padding: 10px 0;
  font-size: 13px;
  width: 100%;
}
</style>
