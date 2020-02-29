<template>
  <div class="app-container">
    <el-card shadow="never" class="box-card" style="width: 35%;">
      <el-table
        ref="table"
        height="83vh"
        :data="list"
        highlight-current-row
        @current-change="handleCurrentChange"
        style="width: 100%"
      >
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="total" label="总AC"> </el-table-column>
      </el-table>
    </el-card>
    <div class="box-card" v-loading="loading" style="width: 65%;">
      <div class="title">
        <span style="padding-right:20px">{{ name }} 的AC日志</span>
        <el-tag size="small">总AC: {{ ac }}</el-tag>
      </div>
      <el-scrollbar style="height: 95%;" v-if="aclist.length != 0">
        <el-timeline>
          <el-timeline-item
            :timestamp="item.create_time"
            placement="top"
            v-for="item in aclist"
            :key="item.index"
          >
            <div class="test">
              <el-card class="ac-card">
                <h4>{{ item.reason }}</h4>
                <p>
                  <span v-if="item.ac > 0" style="padding-right:20px"
                    >AC值变化：+ {{ item.ac }}</span
                  >
                  <span v-else style="padding-right:20px"
                    >AC值变化： {{ item.ac }}</span
                  >
                  <span v-if="item.classify == 0" style="padding-right:20px"
                    >审核人: {{ item.auditor }}</span
                  >
                  <el-tag>{{ getClassfy(item.classify) }}</el-tag>
                </p>
              </el-card>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
      <div class="null" v-else>
        <svg-icon icon-class="null" style="font-size:40px" />
        <div style="height:20px">无AC数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAcSummary, listUserAc } from "@/api/performance";

export default {
  data() {
    return {
      loading: false,
      list: [],
      name: "",
      ac: "",
      aclist: []
    };
  },
  computed: {
    getClassfy() {
      return val => {
        if (val == 0) return "周报申请";
        else if (val == 1) return "项目AC";
        else if (val == 2) return "论文AC";
        else return "投票AC";
      };
    }
  },
  created() {
    getAcSummary().then(res => {
      this.list = res.data;
      this.setCurrent(this.list[0]);
      this.name = this.list[0].name;
      this.ac = this.list[0].total;
      listUserAc(this.list[0].id).then(res => {
        this.aclist = res.data;
      });
    });
  },

  methods: {
    setCurrent(row) {
      this.$refs.table.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.loading = true;
      this.name = val.name;
      this.ac = val.total;
      listUserAc(val.id).then(res => {
        console.log(res.data);
        this.aclist = res.data;
        this.loading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  padding: 5px 40px;
  margin-bottom: 5px;
}
.app-container {
  display: flex;
  justify-content: space-between;
}
.box-card {
  border-radius: 4px;
  border: 1px solid #ebeef5;

  height: 85vh;
  padding: 10px 0px;
  // overflow: auto;
}
.ac-card {
  width: 90%;
}
.box-card /deep/ .el-card__body {
  padding: 0px 20px;
}

.box-card /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}

.null {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100%;
  flex-direction: column;
}
</style>
