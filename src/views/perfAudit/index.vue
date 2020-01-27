<template>
  <div class="app-container">
    <el-drawer :visible.sync="drawer" :modal="false" :with-header="false" size="50%">
      <div class="drawer-container" ref="box" v-if="list.length !== 0 && show">
        <div class="drawer-bar">
          <span>{{ list[index].dcRecordVO.name }} 的申请</span>
          <el-tag style="margin-left:10px">
            {{
            transitionTime(
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
          <el-table
            ref="multipleTable"
            :data="form.acRecordList"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column label="AC申请理由" width="300">
              <template slot-scope="scope">{{ scope.row.reason }}</template>
            </el-table-column>
            <el-table-column prop="ac" label="AC" width="120"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                <el-button
                  @click.native.prevent="
                    deleteRow(scope.$index, form.acRecordList)
                  "
                  type="text"
                  size="small"
                >拒绝</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card class="form-card">
          <div>
            <el-tag style=" margin:5px 5px 5px 0px">D值：{{ list[index].dcRecordVO.dvalue }}</el-tag>
            <el-tag style=" margin:5px">DC值：{{ form.dc }}</el-tag>
            <el-tag style=" margin:5px">AC值：{{ form.ac }}</el-tag>
          </div>
          <el-form label-position="left" label-width="50px" :model="form">
            <el-form-item label="C值">
              <el-input style="width:100px" v-model="form.cvalue"></el-input>
            </el-form-item>
          </el-form>

          <div>
            <el-button>确认提交</el-button>
            <el-button @click="toggleSelection()">上一个</el-button>
            <el-button @click="toggleSelection()">下一个</el-button>
          </div>
        </el-card>
      </div>
    </el-drawer>
    {{ form }}
    <el-tabs v-model="activetab">
      <el-tab-pane label="待审核" name="first">
        <div>
          <el-table
            :data="list"
            style="width: 100%"
            :row-style="{ height: '30px' }"
            :row-class-name="tableRowClassName"
            @row-click="onRowClick"
          >
            <el-table-column label="申请时间" width="150" align="center">
              <template slot-scope="{ row }">
                <span>
                  {{
                  row.dcRecordVO.insertTime | parseTime("{y}-{m}-{d} {h}:{i}")
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="申请周" width="100" align="center">
              <template slot-scope="{ row }">
                <span>
                  {{
                  transitionTime(
                  row.dcRecordVO.yearmonth,
                  row.dcRecordVO.week
                  )
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="dcRecordVO.name" label="姓名" align="center" width="100"></el-table-column>
            <el-table-column prop="dcRecordVO.dvalue" label="申请D值" align="center" width="80"></el-table-column>
            <el-table-column prop="dcRecordVO.dvalue" label="  AC申请">
              <template slot-scope="{ row }">
                <el-tag v-if="row.acItems.length === 0" style="margin:0px 5px">无</el-tag>
                <el-tag
                  v-for="(item, index) in row.acItems"
                  :key="index"
                  style="margin:0px 5px"
                >{{ item.reason }} : {{ item.ac }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已审核" name="second">配置管理</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getAudit } from "@/api/application";
import { getReport } from "@/api/audit";
export default {
  data() {
    return {
      drawer: false,
      activetab: "first",
      list: [],
      index: 0,
      show: true,
      reportList: null,
      report: null,
      form: {
        cvalue: null,
        dc: null,
        ac: null,
        acRecordList: []
      }
    };
  },
  created() {
    getAudit().then(res => {
      this.list = res.data;
      console.log(this.list);
    });
    getReport().then(res => {
      console.log(res.data);
      this.reportList = res.data;
    });
  },
  methods: {
    transitionTime(yearmonth, week) {
      return yearmonth.toString().slice(4, 7) + " 月 第 " + week + " 周";
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    onRowClick(row) {
      this.drawer = !this.drawer; //开启抽屉
      this.index = row.index; //指定当前列
      this.form.acRecordList = this.list[this.index].acItems.slice(0);
      this.form.ac = this.form.acRecordList.reduce(
        (sum, item) => sum + item.ac,
        0
      );
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.box.scrollTop = 0;
        }, 100);
      });
      let value = this.reportList.filter(item => {
        return item.uid == this.list[row.index].dcRecordVO.uid;
      });
      if (value instanceof Array) {
        this.report = value[0].contents;
      } else {
        this.report = value.contents;
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
      this.form.ac = this.form.acRecordList.reduce(
        (sum, item) => sum + item.ac,
        0
      );
    },
    rmItem() {
      console.log(this.index);
      if (this.index !== this.list.length - 1) {
        this.list.splice(this.index, 1);
      } else {
        this.show = false;
        this.list.splice(this.index, 1);
        this.index--;
        this.show = true;
      }
    }
  }
};
</script>

<style scoped>
.app-container >>> .el-drawer__body {
  height: 0;
}

.app-container >>> .el-card__body {
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
  display: flex; /*Flex布局*/
  align-items: center; /*指定垂直居中*/
  padding: 0px 20px;
  width: 100%;
  height: 50px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  position: fixed;
  background-color: white;
}

.el-table tr {
  height: 10px;
}

.el-form-item__label {
  font-weight: normal;
  font-size: 14px;
}

.el-form-item__label {
  font-size: 200;
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
  padding: 10px 0px;
  font-size: 13px;
  width: 100%;
}
</style>
