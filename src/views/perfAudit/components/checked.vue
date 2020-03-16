<template>
  <div class="checked">
    <!-- 详细信息 drawer -->
    <el-drawer :visible.sync="drawer" :modal="false" :with-header="false" size="50%">
      <div class="drawer-container" v-loading="loading">
        <div class="drawer-bar">
          <span>{{ temp.name }} 的申请</span>
          <el-tag style="margin-left:10px">
            {{ temp.yearmonth | formatWeek(temp.week) }}
          </el-tag>
        </div>

        <el-card class="report-card">
          <div v-for="(item, index) in report" :key="index" class="item">
            <li>{{ item.key }}</li>
            <p style="white-space: pre-line">{{ item.value }}</p>
          </div>
          <div v-if="report == null" style="height:180px">
            未获取到周报内容,可能原因：
            <ul>
              <li>bug</li>
              <li>申请人未在指定时间提交</li>
              <li>申请人选择未选择正确的周</li>
            </ul>
          </div>
        </el-card>

        <el-card class="ac-card">
          <el-table :data="temp.acItems" tooltip-effect="dark">
            <el-table-column label="AC申请理由">
              <template slot-scope="{ row }">
                <span :class="{ text_span: !row.status }">{{
                  row.reason
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="AC" align="center">
              <template slot-scope="{ row }">
                <template v-if="row.edit">
                  <el-input v-model="row.ac" style="width:50px" />
                </template>
                <span :class="{ text_span: !row.status }" v-else>{{
                  row.ac
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <template v-if="row.edit">
                  <el-button type="text" size="small" icon="el-icon-circle-check-outline" @click="confirmEdit(row)">
                    确定
                  </el-button>
                  <el-button type="text" size="small" @click="cancelEdit(row)">
                    取消
                  </el-button>
                </template>
                <template v-else>
                  <el-button type="text" :disabled="row.reject" size="small" icon="el-icon-edit" @click="row.edit = !row.edit">
                    修改
                  </el-button>
                  <el-button v-if="!row.reject" type="text" size="small" @click.native.prevent="rejectAcRow(row)">拒绝</el-button>
                  <el-button v-if="row.reject" type="text" size="small" @click.native.prevent="rejectAcRow(row)">恢复</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin:12px 0 4px 8px">
            <span style="color:red">累计AC值：{{ temp.ac }}</span>
          </div>
        </el-card>

        <el-card class="form-card">
          <div style="margin:10px 0">
            <span style="margin-right:30px">D值：{{ temp.dvalue }}</span>

            <span>DC值：{{ temp.dc }}</span>
          </div>
          <el-form label-position="left" label-width="50px" ref="form">
            <el-form-item label="C值:">
              <el-input v-model="temp.cvalue" style="width:80px" />
            </el-form-item>
          </el-form>

          <div>
            <el-button @click="submit()">确认提交</el-button>
          </div>
        </el-card>
      </div>
    </el-drawer>
    <!-- 筛选 -->
    <div style="margin-bottom:5px">
      <el-date-picker v-model="date" @change="getDate" value-format="yyyy-MM-dd" type="week" format="yyyy 第 WW 周" style="width:150px" placeholder="选择周" :picker-options="{ firstDayOfWeek: 1 }">
      </el-date-picker>
      <el-button @click="filterData" type="primary" size="mini" icon="el-icon-search" style="margin-left:5px">
        筛选
      </el-button>
      <el-button @click="refresh" size="mini" icon="el-icon-refresh-right" style="margin-left:5px">
        重置
      </el-button>
    </div>

    <!-- 审核过的数据 -->
    <el-table :data="list" style="width: 100%;">
      <el-table-column width="30px" type="expand">
        <template slot-scope="props">
          <div>
            <span v-if="props.row.acItems.length == 0">无AC申请数据</span>
            <template v-else>
              <li v-for="(o, index) in props.row.acItems" :key="index">
                {{ o.reason }}, ac值: {{ o.ac }}
              </li>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请时间">
        <template slot-scope="{ row }">{{
          row.insertTime | parseTime("{y}-{m}-{d} {h}:{i}")
        }}</template>
      </el-table-column>
      <el-table-column label="申请周">
        <template slot-scope="{ row }">
          {{ row.yearmonth | formatWeek(row.week) }}
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="审核结果" align="center">
        <template slot-scope="{ row }">
          <el-tag style="margin-right:10px">DC值：{{ row.dc }} </el-tag>
          <el-tag>AC值：{{ row.ac }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <el-button type="text" size="mini" icon="el-icon-edit" @click="modify(row, $index)">
            修改
          </el-button>
        </template>
      </el-table-column>
      <template slot="empty">
        <div style="height:300px;">
          <div style="margin-top:100px;">
            <svg-icon icon-class="null" style="font-size:32px" /> <br />
          </div>
          <div style="line-height: 10px;">
            <span>没有已审核内容</span>
          </div>
        </div>
      </template>
    </el-table>
  </div>
</template>
<script>
import {
  getChecked,
  fetchReport,
  updateAudit,
  getCheckedByDate
} from "@/api/audit";
export default {
  data() {
    return {
      list: [],
      span_style: true,
      show: true,
      loading: false,
      drawer: false,
      date: null,
      index: null,
      report: null,
      temp: {
        name: "",
        ac: "",
        dvalue: "",
        cvalue: "",
        dc: "",
        yearmonth: "",
        week: "",
        acItems: []
      },
      form: {
        id: null,
        cvalue: null,
        dc: null,
        ac: null,
        acItems: []
      },
      rules: {
        cvalue: [{ required: true, message: "请输入C值", trigger: "blur" }]
      }
    };
  },
  watch: {
    "temp.cvalue"() {
      this.temp.dc =
        (this.temp.cvalue * 1000 * (this.temp.dvalue * 1000)) / 1000000; // 小数计算存在精度问题
    }
  },
  created() {
    getChecked().then(res => {
      this.list = res.data;
    });
  },
  methods: {
    // 提交修改
    submit() {
      if (this.temp.cvalue) {
        this.form.id = this.temp.id;
        this.form.cvalue = this.temp.cvalue;
        this.form.dc = this.temp.dc;
        this.form.ac = this.temp.ac;
        this.form.acItems = this.temp.acItems;
        updateAudit(this.form).then(() => {
          this.$notify({
            title: "成功",
            message:
              this.temp.name +
              "  DC值：" +
              this.temp.dc +
              "  AC值：" +
              this.temp.ac,
            type: "success"
          });
          //todo 更新列表
          this.$set(this.list, this.index, this.temp);
        });

        setTimeout(() => (this.drawer = false), 800);
      } else {
        this.$notify({
          title: "失败",
          message: "C值不能为空",
          type: "warning"
        });
      }
    },
    // 取消编辑ac
    cancelEdit(row) {
      row.ac = row.originalAc;
      row.edit = false;
      this.$message({
        message: "The title has been restored to the AC value",
        type: "warning"
      });
    },
    // 确认编辑ac
    confirmEdit(row) {
      row.edit = false;
      row.ac *= 1;
      row.originalAc = row.ac;
      this.temp.ac = this.temp.acItems
        .filter(item => item.status === true)
        .reduce((sum, item) => sum + item.ac, 0);
      this.$message({
        message: "The AC has been edited",
        type: "success"
      });
    },
    // 拒绝ac
    rejectAcRow(row) {
      row.reject = !row.reject;
      row.status = !row.status;
      this.temp.ac = this.temp.acItems
        .filter(item => item.status === true)
        .reduce((sum, item) => sum + item.ac, 0);
    },
    // 点击列表中某行，触发
    modify(row, index) {
      this.index = index;
      this.loading = true;

      this.drawer = !this.drawer;
      this.temp = JSON.parse(JSON.stringify(row)); //深拷贝
      this.temp.acItems = this.temp.acItems.map(item => {
        this.$set(item, "edit", false);
        this.$set(item, "reject", false);
        item.reject = !item.status;
        item.originalAc = item.ac;
        return item;
      });
      fetchReport(row.uid, row.weekdate).then(res => {
        this.report = res.data.contents;
        this.loading = false;
      });
    },
    // 将日期选择器的时间+2天
    getDate() {
      let date = new Date(this.date);
      this.date = new Date(date.setDate(date.getDate() + 2));
    },
    // 筛选数据
    filterData() {
      if (this.date == null) {
        this.$message.error("错了哦，日期不能为空");
      } else {
        getCheckedByDate(this.date).then(res => {
          this.list = res.data;
        });
      }
    },
    // 刷新
    refresh() {
      getChecked().then(res => {
        this.list = res.data;
        this.date = "";
      });
    }
  }
};
</script>

<style scoped>
.text_span {
  text-decoration: line-through;
  color: #d9d9d9;
}

::-webkit-scrollbar {
  width: 0px;
}

.checked >>> .el-drawer__body {
  height: 0;
}

.checked >>> .el-card__body {
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
