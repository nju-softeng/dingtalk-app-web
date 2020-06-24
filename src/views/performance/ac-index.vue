<template>
  <div class="app-container">
    <div class="box-ac">
      <!-- AC排名 -->
      <el-card shadow="never" class="box-ac-card" style="width: 35%;">
        <el-table class="table" ref="table" height="83vh" :data="list" highlight-current-row @current-change="handleCurrentChange" style="width: 100%" :header-cell-style="{ background: '#eef1f6' }">
          <el-table-column type="index"> </el-table-column>
          <el-table-column prop="name" label="姓名"> </el-table-column>
          <el-table-column prop="total" label="总AC"> </el-table-column>
        </el-table>
      </el-card>
      <!-- 详细AC -->
      <div class="box-ac-card" v-loading="loading" style="width: 65%;">
        <!-- 标题 -->
        <div class="title">
          <span style="padding-right:20px">{{ name }} 的AC日志</span>
          <el-tag size="small">总AC: {{ ac }}</el-tag>
        </div>
        <!-- 详细AC -->
        <el-scrollbar style="height: 93%;" v-if="aclist.length != 0">
          <el-timeline>
            <el-timeline-item :timestamp="item.create_time" placement="top" v-for="(item, index) in aclist" :key="index">
              <div class="test">
                <el-card shadow="never" class="ac-card">
                  <p>{{ item.reason }}</p>
                  <p>
                    <span v-if="item.ac > 0" style="padding-right:20px">AC值变化：+ {{ item.ac }}</span>
                    <span v-else style="padding-right:20px">AC值变化： {{ item.ac }}</span>
                    <span v-if="item.classify == 0" style="padding-right:20px">审核人: {{ item.auditor }}</span>
                    <el-tag>{{ getClassify(item.classify) }}</el-tag>
                  </p>
                </el-card>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-scrollbar>
        <div class="null" v-else>
          <svg-icon icon-class="null" style="font-size:32px" />
          <div style="font-size:13px;height:20px;color:rgba(0, 0, 0, 0.45);">
            无AC数据
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAcSummary, listUserAc } from '@/api/performance';

export default {
  data() {
    return {
      loading: false,
      list: [],
      name: '',
      ac: '',
      aclist: []
    };
  },
  computed: {
    getClassify() {
      return val => {
        if (val == 0) return '周报申请';
        else if (val == 1) return '项目AC';
        else if (val == 2) return '论文AC';
        else if (val == 4) return 'bug';
        else return '投票AC';
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

.box-ac {
  max-width: 1056px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: space-between;
}
.box-ac-card {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  height: 85vh;
  padding: 10px 0px;
  background-color: white;
}
.ac-card {
  width: 90%;
}
.box-ac-card /deep/ .el-card__body {
  padding: 0px 20px;
}

.box-ac-card /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}

.null {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100%;
  flex-direction: column;
}

//滚动条的宽度
.table /deep/ .el-table__body-wrapper::-webkit-scrollbar {
  width: 5px;
}
//滚动条的滑块
.table /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #d3d3d3;
  border-radius: 3px;
}
</style>
