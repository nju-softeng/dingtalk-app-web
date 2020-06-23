<template>
  <div class="app-container">
    <div class="box">
      <div>
        <el-date-picker size="mini" v-model="date" :clearable="false" value-format="yyyy-MM-dd" @change="filtrate"
          type="month" style="width:120px" placeholder="选择月">
        </el-date-picker>
        <el-button-group style="margin-left:5px">
          <el-button @click="prev" icon="el-icon-arrow-left">上一月</el-button>
          <el-button @click="next">下一月<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-button-group>
      </div>

      <el-table v-loading="loading" element-loading-spinner="el-icon-loading" class="table" stripe :data="list" border
        style="margin-top:10px;" height="77.5vh">
        <el-table-column fixed label="学号" width="100" align="center">
          <template slot-scope="{ row }">
            {{ row.stu_num || "未设置" }}
          </template>
        </el-table-column>
        <el-table-column fixed prop="name" label="姓名" align="center">
        </el-table-column>
        <el-table-column label="助研金" align="center">
          <template slot-scope="{ row }">
            {{ row.salary || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="第1周DC" align="center">
          <template slot-scope="{ row }">
            {{ row.week1 || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="第2周DC" align="center">
          <template slot-scope="{ row }">
            {{ row.week2 || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="第3周DC" align="center">
          <template slot-scope="{ row }">
            {{ row.week3 || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="第4周DC" align="center">
          <template slot-scope="{ row }">
            {{ row.week4 || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="第5周DC" align="center">
          <template slot-scope="{ row }">
            {{ row.week5 || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="本月总DC" align="center">
          <template slot-scope="{ row }">
            {{ row.total || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="当前AC值" align="center">
          <template slot-scope="{ row }">
            {{ row.ac || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="topup" align="center" width="140">
          <template slot-scope="{ row }">
            <template v-if="!row.edit">
              {{ row.topup || 0 }}

              <el-button type="text" v-if="roles.includes('admin')" icon="el-icon-edit" @click="row.edit = true"
                style="margin-left:16px">
              </el-button>
            </template>
            <template v-else>
              <el-input v-model="row.topup" placeholder="请输入内容"></el-input>
              <el-button type="text" icon="el-icon-check" @click="
                  row.edit = false;
                  updateTopup(row);
                " style="margin-right:8px">
                确认
              </el-button>
              <el-button type="text" icon="el-icon-close" @click="row.edit = false" style="margin-left:8px">
                取消
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getDcSummary, updateTopup } from "@/api/performance";
export default {
  data() {
    return {
      loading: false,
      list: null,
      date: new Date().toISOString().slice(0, 10)
    };
  },
  created() {
    this.fetchDcSummary(new Date());
  },
  computed: {
    ...mapGetters(["roles"])
  },
  methods: {
    updateTopup(row) {
      let vo = {
        uid: row.uid,
        yearmonth: this.date.slice(0, 8).replace(/-/g, ""),
        topup: row.topup
      };
      console.log(vo);
      updateTopup(vo).then(() => {
        this.date = new Date(this.date);
        this.date = this.date.toISOString().slice(0, 10);
        this.fetchDcSummary(this.date);
        this.$message({
          showClose: true,
          message: "编辑成功",
          type: "success"
        });
      });
    },
    fetchDcSummary(date) {
      getDcSummary(date).then(res => {
        this.list = res.data.map(item => {
          item.edit = false;
          return item;
        });
      });
    },
    filtrate() {
      if (this.date != undefined) {
        this.fetchDcSummary(this.date);
      } else {
        this.$message({
          showClose: true,
          message: "请选择月份",
          type: "warning"
        });
      }
    },
    next() {
      if (typeof this.date == "string") {
        this.date = new Date(this.date);
      }
      this.loading = true;
      this.date.setMonth(this.date.getMonth() + 1);
      this.date = this.date.toISOString().slice(0, 10);
      this.fetchDcSummary(this.date);
      setTimeout(() => {
        this.loading = false;
      }, 400);
    },
    prev() {
      if (typeof this.date == "string") {
        this.date = new Date(this.date);
      }
      this.loading = true;
      this.date.setMonth(this.date.getMonth() - 1);
      this.date = this.date.toISOString().slice(0, 10);
      this.fetchDcSummary(this.date);
      setTimeout(() => {
        this.loading = false;
      }, 400);
    }
  }
};
</script>
<style scoped>
.app-container >>> .el-table th.gutter {
  display: table-cell !important;
}

.app-container {
  padding: 12px;
  background-color: #f5f5f5;
  min-height: 92vh;
  border-radius: 0;
}

.box {
  max-width: 1072px;
  margin-left: auto;
  margin-right: auto;
  background: #fff;
  padding: 10px 15px;
  min-height: 89vh;
}
</style>
