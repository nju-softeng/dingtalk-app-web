<template>
  <div class="app-container">
    <div class="box">
      <div>
        <el-date-picker v-model="date" size="mini" :clearable="false" value-format="yyyy-MM-dd" type="month" style="width:120px" placeholder="选择月" @change="filtrate" />
        <el-button-group style="margin-left:5px">
          <el-button icon="el-icon-arrow-left" @click="prev">上一月</el-button>
          <el-button @click="next">下一月<i class="el-icon-arrow-right el-icon--right" /></el-button>
        </el-button-group>
        <el-button-group style="margin-left:5px">
          <el-button icon="el-icon-bottom-right" @click="desc" />
          <el-button icon="el-icon-top-right" @click="asc" />
        </el-button-group>
        <el-button :loading="downloadLoading" style="margin:0 0 5px 5px;" icon="el-icon-document" @click="handleDownload">
          Export Excel
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        element-loading-spinner="el-icon-loading"
        class="table"
        stripe
        :data="list"
        border
        style="margin-top:10px;"
        height="79vh"
        :header-cell-style="{ background: '#eef1f6' }"
      >
        <el-table-column fixed label="学号" align="center">
          <template slot-scope="{ row }">
            {{ row.stu_num || '未设置' }}
          </template>
        </el-table-column>
        <el-table-column fixed prop="name" label="姓名" align="center" width="92" />
        <el-table-column label="助研金" align="center" width="82" prop="salary">
          <template slot-scope="{ row }">
            {{ row.salary || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="第1周DC" align="center" prop="week1">
          <template slot-scope="{ row }">
            {{ row.week1 || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="第2周DC" align="center" prop="week2">
          <template slot-scope="{ row }">
            {{ row.week2 || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="第3周DC" align="center" prop="week2">
          <template slot-scope="{ row }">
            {{ row.week3 || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="第4周DC" align="center" prop="week3">
          <template slot-scope="{ row }">
            {{ row.week4 || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="第5周DC" align="center" prop="week4">
          <template slot-scope="{ row }">
            {{ row.week5 || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="总DC" align="center" prop="week5">
          <template slot-scope="{ row }">
            {{ row.total || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="当前AC" align="center" prop="ac">
          <template slot-scope="{ row }">
            {{ row.ac || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="Topup" align="center" width="130">
          <template slot-scope="{ row }">
            <template v-if="!row.edit">
              {{ row.topup || 0 }}

              <el-button v-if="roles.includes('auditor') || roles.includes('admin')" type="text" icon="el-icon-edit" style="margin-left:16px" @click="row.edit = true" />
            </template>
            <template v-else>
              <el-input v-model="row.topup" placeholder="请输入内容" />
              <el-button
                type="text"
                icon="el-icon-check"
                style="margin-right:8px"
                @click="
                  row.edit = false;
                  updateTopup(row);
                "
              >
                确认
              </el-button>
              <el-button type="text" icon="el-icon-close" style="margin-left:8px" @click="row.edit = false">
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
import { mapGetters } from 'vuex'
import { getDcSummary, updateTopup } from '@/api/performance'

export default {
  data() {
    return {
      loading: false,
      list: null,
      downloadLoading: false,
      date: new Date().toISOString().slice(0, 10)
    }
  },
  created() {
    this.fetchDcSummary(new Date())
  },
  computed: {
    ...mapGetters(['roles']),
    filename() {
      return this.date + '-绩效汇总'
    }
  },
  methods: {
    desc() {
      this.fetchDcSummary(this.date, true)
    },
    asc() {
      this.fetchDcSummary(this.date, false)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['学号', '姓名', '补贴总金额', '第一周DC值', '第一周DC值', '第一周DC值', '第一周DC值', '第一周DC值', '本月总DC值', '当前AC值', 'Topup']
        const filterVal = ['stu_num', 'name', 'salary', 'week1', 'week2', 'week3', 'week4', 'week5', 'total', 'ac', 'topup']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
        console.log(data)
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          console.log(j)
          return v[j]
        })
      )
    },
    updateTopup(row) {
      const vo = {
        uid: row.uid,
        yearmonth: this.date.slice(0, 8).replace(/-/g, ''),
        topup: row.topup
      }
      console.log(vo)
      updateTopup(vo).then(() => {
        this.date = new Date(this.date)
        this.date = this.date.toISOString().slice(0, 10)
        this.fetchDcSummary(this.date)
        this.$message({
          showClose: true,
          message: '编辑成功',
          type: 'success'
        })
      })
    },
    fetchDcSummary(day, isDesc = true) {
      getDcSummary({ date: day, desc: isDesc }).then(res => {
        this.list = res.data.map(item => {
          item.edit = false
          return item
        })
        // console.log(this.list)
      })
    },
    filtrate() {
      if (this.date !== undefined) {
        this.fetchDcSummary(this.date)
      } else {
        this.$message({
          showClose: true,
          message: '请选择月份',
          type: 'warning'
        })
      }
    },
    next() {
      if (typeof this.date === 'string') {
        this.date = new Date(this.date)
      }
      this.loading = true
      this.date.setMonth(this.date.getMonth() + 1)
      this.date = this.date.toISOString().slice(0, 10)
      this.fetchDcSummary(this.date)
      setTimeout(() => {
        this.loading = false
      }, 400)
    },
    prev() {
      if (typeof this.date === 'string') {
        this.date = new Date(this.date)
      }
      this.loading = true
      this.date.setMonth(this.date.getMonth() - 1)
      this.date = this.date.toISOString().slice(0, 10)
      this.fetchDcSummary(this.date)
      setTimeout(() => {
        this.loading = false
      }, 400)
    }
  }
}
</script>
<style scoped>
.app-container >>> .el-table th.gutter {
  display: table-cell !important;
}

.app-container {
  padding: 12px;
  background-color: #fafafa;
  border-radius: 0;
}

.box {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  background: #fff;
  padding: 10px 15px;
  min-height: 89vh;
}

@media only screen and (min-width: 1400px) {
  .box {
    max-width: 1305px !important;
  }
}

</style>
