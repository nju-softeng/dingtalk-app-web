<template>
  <div class="app-container">
    <div class="wrap1">
      <!-- 周绩效申请 drawer -->
      <drawer :show.sync="show" :direction="direction" :tmp="tmp" :auditors="auditors" @submitted="submitted" />
      <div class="box">
        <!-- 申请按钮 -->
        <el-button type="primary" icon="el-icon-plus" style="margin : 0px 0px 10px 0px;" @click="addApply()">提交申请
        </el-button>
        <!-- 已提的交申请 -->
        <div style="height:430px">
          <el-table
            :data="list"
            fit
            highlight-current-row
            style="width: 100%"
            :header-cell-style="{ background: '#eef1f6' }"
          >
            <el-table-column width="30px" label="#" type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline>
                  <el-form-item label="AC申请：">
                    <span v-if="props.row.acItems.length == 0"> 无 </span>
                    <div v-else>
                      <li v-for="(item, index) in props.row.acItems" :key="index">
                        申请值: {{ item.ac }} / 申请理由：{{ item.reason }}
                      </li>
                    </div>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>

            <el-table-column width="140px" align="center" label="提交日期">
              <template slot-scope="{ row }">
                <span>{{
                  row.insertTime | parseTime("{y}-{m}-{d} {h}:{i}")
                }}</span>
              </template>
            </el-table-column>

            <el-table-column width="140px" align="center" label="报表月周">
              <template slot-scope="{ row }">
                <span>{{ row.yearmonth | formatWeek(row.week) }}</span>
              </template>
            </el-table-column>

            <el-table-column width="90px" align="center" label="审核人">
              <template slot-scope="{ row }">
                <span>{{ row.auditorName }}</span>
              </template>
            </el-table-column>

            <el-table-column width="80px" label="D值">
              <template slot-scope="{ row }">
                <span>{{ row.dvalue }}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="200px" label="审核结果">
              <template slot-scope="{ row }">
                <template v-if="row.status">
                  <el-tag style="margin-right:5px">C值: {{ row.cvalue }}</el-tag>
                  <el-tag style="margin-right:5px">DC值: {{ row.dc }}</el-tag>
                  <el-tag>AC值: {{ row.ac }}</el-tag>
                </template>
                <template v-else>
                  <el-tag type="warning">待审核</el-tag>
                </template>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作">
              <template slot-scope="{ row }">
                <el-button v-if="!row.status || isAuditor(row.auditorid)" type="text" size="mini" icon="el-icon-edit" @click="addModify(row)">修改
                </el-button>
                <el-tag v-else type="info">已审核</el-tag>
                <!-- <el-button v-else type="primary" size="small" icon="el-icon-edit" @click="drawer = true">重新申请</el-button> -->
              </template>
            </el-table-column>
            <template slot="empty">
              <div style="height:280px;">
                <div style="margin-top:100px;">
                  <svg-icon icon-class="null" style="font-size:32px" /> <br>
                </div>
                <div style="line-height: 10px;">
                  <span>没有已申请内容</span>
                </div>
              </div>
            </template>
          </el-table>
        </div>
        <!-- 分页 -->
        <div style="text-align:center; margin-top:5px">
          <el-pagination
              background
              :hide-on-single-page="total < 10 ? true : false"
              small
              layout="prev, pager, next"
              :total="total"
              :page-size="10"
              @prev-click="handlePrev"
              @next-click="handleNext"
              @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listAuditors } from '@/api/user'
import { getUserApplication } from '@/api/application'
import drawer from './components/drawer'
export default {
  components: { drawer },
  data: () => ({
    show: false,
    tmp: {},
    auditors: [],
    loading: false,
    direction: 'ltr',
    list: [],
    total: 0,
    uid: '',
    role: ''
  }),
  computed: {
    isAuditor() {
      return aid => {
        if (aid === this.uid && this.role === 'auditor') {
          console.log('true')
          return true
        } else {
          console.log('false')
          return false
        }
      }
    }

  },
  created() {
    listAuditors()
      .then(res => {
        this.auditors = res.data.auditorlist
      })
      .then(() => {
        this.fetchApplication(1)
      })
    this.uid = sessionStorage.getItem('uid')
    this.role = sessionStorage.getItem('role')
  },
  methods: {
    // 获取申请记录
    fetchApplication(page) {
      getUserApplication(page, 10).then(res => {
        this.list = res.data.list
        this.total = res.data.total
        console.log(this.list)
      })
    },
    // 分页获取数据
    handleCurrentChange(val) {
      this.fetchApplication(val)
    },
    // 上一页
    handlePrev(val) {
      this.fetchApplication(val)
    },
    // 下一页
    handleNext(val) {
      this.fetchApplication(val)
    },
    // 点击添加后调用
    addApply() {
      this.tmp = null
      this.direction = 'ltr'
      this.show = true
    },
    // 点击修改后调用
    addModify(row) {
      this.tmp = row
      this.direction = 'rtl'
      this.show = true
    },
    // 提交后刷新数据
    submitted() {
      this.fetchApplication(1)
    }
  }
}
</script>

<style lang="scss" scope>
.wrap1 {
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

@media only screen and (min-width: 1400px) {
  .wrap1 {
    max-width: 1305px !important;
  }
}

.app-container {
  padding: 12px;
  background-color: #fafafa;
  border-radius: 0;
}

.box {
  background: #fff;
  padding: 10px 15px;
  min-height: 540px;
}
</style>
