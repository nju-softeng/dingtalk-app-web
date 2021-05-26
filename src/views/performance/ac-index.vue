<template>
  <div class="app-container">
    <div class="box-ac">
      <el-button type="primary" style="margin-bottom: 8px; margin-left: 2px" icon="el-icon-document" @click="dialog = true">
        导出AC数据
      </el-button>

    </div>
    <div class="box-ac">
      <!-- AC排名 -->
      <el-card shadow="never" class="box-ac-card" style="width: 35%;">
        <el-table ref="table" class="table" height="83vh" :data="list" highlight-current-row style="width: 100%" :header-cell-style="{ background: '#eef1f6' }" @current-change="handleCurrentChange">
          <el-table-column type="index" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="total" label="总AC" />
        </el-table>
      </el-card>
      <!-- 详细AC -->
      <div v-loading="loading" class="box-ac-card" style="width: 65%;">
        <!-- 标题 -->
        <div class="title">
          <span style="padding-right:20px">{{ name }} 的AC日志</span>
          <el-tag size="small">总AC: {{ ac }}</el-tag>
        </div>
        <!-- 详细AC -->
        <el-scrollbar v-if="aclist.length != 0" style="height: 93%;">
          <el-timeline>
            <el-timeline-item v-for="(item, index) in aclist" :key="index" :timestamp="item.create_time" placement="top">
              <div class="test">
                <el-card shadow="never" class="ac-card">
                  <p style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{ item.reason }}</p>
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
        <div v-else class="null">
          <svg-icon icon-class="null" style="font-size:32px" />
          <div style="font-size:13px;height:20px;color:rgba(0, 0, 0, 0.45);">
            无AC数据
          </div>
        </div>
      </div>
    </div>

    <!-- 投稿结果  dialog -->
    <el-dialog class="download" title="导出AC数据" :lock-scroll="false" width="380px" :visible.sync="dialog" @submit.native.prevent>
      <el-date-picker
        v-model="date"
        style="width:100%; margin-bottom: 0px"
        type="month"
        value-format="yyyy-MM-dd"
        placeholder="选择导出的月份"
      />

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="width:100%" @click="download"> 下 载 </el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getAcSummary, listUserAc } from '@/api/performance'
import { downloadAcData } from '@/api/excel'
import fileDownload from 'js-file-download'

export default {
  data() {
    return {
      dialog: false,
      loading: false,
      list: [],
      name: '',
      ac: '',
      aclist: [],
      date: null
    }
  },
  computed: {
    getClassify() {
      return val => {
        if (val === 0) return '周报申请'
        else if (val === 1) return '项目AC'
        else if (val === 2) return '论文AC'
        else if (val === 4) return 'bug'
        else return '投票AC'
      }
    }
  },
  created() {
    getAcSummary().then(res => {
      this.list = res.data
      this.setCurrent(this.list[0])
      this.name = this.list[0].name
      this.ac = this.list[0].total
      listUserAc(this.list[0].id).then(res => {
        this.aclist = res.data
      })
    })
  },

  methods: {
    setCurrent(row) {
      this.$refs.table.setCurrentRow(row)
    },
    handleCurrentChange(val) {
      this.loading = true
      this.name = val.name
      this.ac = val.total
      listUserAc(val.id).then(res => {
        console.log(res.data)
        this.aclist = res.data
        this.loading = false
      })
    },
    download() {
      const dateValue = new Date(this.date)
      downloadAcData(dateValue).then(res => {
        if (this.date != null) {
          fileDownload(res.data, dateValue.toISOString().substr(0, 7) + '.xlsx')
          this.dialog = false
        } else {
          this.$message('请选择日期')
        }
      }).catch(err => {
        this.$message.error('下载失败')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.download /deep/ .el-dialog__body {
  padding-bottom: 8px;
}

.title {
  padding: 5px 40px;
  margin-bottom: 5px;
}

@media only screen and (min-width: 1400px) {
  .box-ac {
    max-width: 1305px !important;
  }
}

.box-ac {
  max-width: 1200px;
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
