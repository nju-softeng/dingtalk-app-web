<template>
  <div class="checking">
    <el-drawer :visible.sync="drawer" :modal="false" :with-header="false" size="55%">
      <div v-if="list.length !== 0 && show" ref="drawer" class="drawer-container" v-loading="loading">
        <div class="drawer-bar">
          <span>{{ list[index].dcRecordVO.name }} 的申请</span>
          <el-tag style="margin-left:10px">
            {{
              showDate(
                list[index].dcRecordVO.yearmonth,
                list[index].dcRecordVO.week
              )
            }}
          </el-tag>
        </div>

        <el-card class="report-card">
          <div v-for="(item, index) in report" :key="index" class="item">
            <li>{{ item.key }}</li>
            <p>{{ item.value }}</p>
          </div>
        </el-card>

        <el-card class="ac-card">
          <el-table :data="form.acRecords" tooltip-effect="dark">
            <el-table-column label="AC申请理由" width="300">
              <template slot-scope="{ row }">{{ row.reason }}</template>
            </el-table-column>
            <el-table-column label="AC" align="center" width="120">
              <template slot-scope="{ row }">
                <template v-if="row.edit">
                  <el-input v-model="row.ac" />
                </template>
                <span v-else>{{ row.ac }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <template v-if="row.edit">
                  <el-button type="text" size="small" icon="el-icon-circle-check-outline" @click="confirmEdit(row)">
                    保存
                  </el-button>
                  <el-button type="text" size="small" @click="cancelEdit(row)">
                    取消
                  </el-button>
                </template>
                <template v-else>
                  <el-button type="text" size="small" icon="el-icon-edit" @click="row.edit = !row.edit">
                    编辑
                  </el-button>
                  <el-button type="text" size="small" @click.native.prevent="
                      deleteAcRow(row.$index, form.acRecords)
                    ">拒绝</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card class="form-card">
          <div style="margin:10px 0">
            <span style="margin-right:30px">D值：{{ list[index].dcRecordVO.dvalue }}</span>
            <span style="margin-right:30px">AC值：{{ form.ac }}</span>
            <span>DC值：{{ form.dc }}</span>
          </div>
          <el-form label-position="left" label-width="50px" :model="form">
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
              {{ row.dcRecordVO.insertTime | parseTime("{y}-{m}-{d} {h}:{i}") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="申请周" width="100" align="center">
          <template slot-scope="{ row }">
            <span>
              {{ showDate(row.dcRecordVO.yearmonth, row.dcRecordVO.week) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="dcRecordVO.name" label="姓名" align="center" width="100" />
        <el-table-column prop="dcRecordVO.dvalue" label="申请D值" align="center" width="80" />
        <el-table-column prop="dcRecordVO.dvalue" label="  AC申请">
          <template slot-scope="{ row }">
            <el-tag v-if="row.acItems.length === 0" style="margin:0px 5px">无</el-tag>
            <el-tag v-for="(item, index) in row.acItems" :key="index" style="margin:0px 5px">{{ item.reason }} : {{ item.ac }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
        acRecords: []
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
      this.form.dc = this.form.cvalue * this.list[this.index].dcRecordVO.dvalue;
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
      row.originalAc = row.ac;
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
      this.index = row.index; // 指定当前列
      let _self = this;
      this.$options.methods.showDetail(_self);
    },
    deleteAcRow(index, rows) {
      rows.splice(index, 1);
      this.form.ac = this.form.acRecords.reduce(
        (sum, item) => sum + item.ac,
        0
      );
    },

    showDetail(_self) {
      _self.form.id = _self.list[_self.index].dcRecordVO.id;
      _self.form.acRecords = _self.list[_self.index].acItems.slice(0).map(v => {
        _self.$set(v, "edit", false);
        v.originalAc = v.ac;
        return v;
      });
      console.log(_self.form.acRecords);
      _self.form.ac = _self.form.acRecords.reduce(
        (sum, item) => sum + item.ac,
        0
      );
      _self.$nextTick(() => {
        setTimeout(() => {
          _self.$refs.drawer.scrollTop = 0;
        }, 100);
      });
      let value = _self.reportList.filter(item => {
        return item.uid == _self.list[_self.index].dcRecordVO.uid;
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
