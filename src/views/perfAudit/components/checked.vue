<template>
  <div class="checked">
    <el-drawer :visible.sync="drawer" :modal="false" :with-header="false" size="50%">
      <div class="drawer-container">
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
          <el-table :data="temp.acItems" tooltip-effect="dark">
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
                      deleteAcRow(row.$index, temp.acItems)
                    ">拒绝</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card class="form-card">
          <div style="margin:10px 0">
            <span style="margin-right:30px">D值：{{ temp.dvalue }}</span>
            <span style="margin-right:30px">AC值：{{ temp.ac }}</span>
            <span>DC值：{{ temp.dc }}</span>
          </div>
          <el-form label-position="left" label-width="50px" :model="form">
            <el-form-item label="C值">
              <el-input v-model="temp.cvalue" style="width:80px" />
            </el-form-item>
          </el-form>

          <div>
            <el-button @click="submit()">确认提交</el-button>
          </div>
        </el-card>
      </div>
    </el-drawer>

    <el-date-picker v-model="date" type="week" format="yyyy 第 WW 周" style="width:150px" placeholder="选择周" :picker-options="{ firstDayOfWeek: 1 }">
    </el-date-picker>

    <el-button type="primary" icon="el-icon-search" style="margin-left:5px">
      筛选
    </el-button>
    <br />
    {{ list[0] }}
    <br />
    {{ temp }}

    <el-table :data="list" style="width: 100%">
      <el-table-column label="申请时间" width="180">
        <template slot-scope="{ row }">{{
          row.insertTime | parseTime("{y}-{m}-{d} {h}:{i}")
        }}</template>
      </el-table-column>
      <el-table-column label="申请周" width="180">
        <template slot-scope="{ row }">
          {{ showDate(row.yearmonth, row.week) }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="180">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="审核结果">
        <template slot-scope="{ row }">
          <el-tag style="margin-right:10px">DC值：{{ row.dc }} </el-tag>
          <el-tag>AC值：{{ row.ac }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" size="mini" icon="el-icon-edit" @click="modify(row)">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getChecked } from "@/api/audit";
export default {
  data() {
    return {
      list: [],
      show: true,
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
      }
    };
  },
  watch: {
    "temp.cvalue"() {
      console.log("test");
      this.temp.dc = this.temp.cvalue * this.temp.dvalue;
    }
  },
  created() {
    getChecked().then(res => {
      console.log(res.data);
      this.list = res.data;
    });
    console.log("hello checked");
  },
  methods: {
    submit() {},
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
    modify(row) {
      this.drawer = !this.drawer;
      this.temp = JSON.parse(JSON.stringify(row)); //深拷贝
      this.temp.acItems = this.temp.acItems.map(item => {
        this.$set(item, "edit", false);
        item.originalAc = item.ac;
        return item;
      });
      console.log(row);
    },
    deleteAcRow(index, rows) {
      rows.splice(index, 1);
      this.temp.ac = this.temp.acRecords.reduce(
        (sum, item) => sum + item.ac,
        0
      );
    }
  }
};
</script>

<style scoped>
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
