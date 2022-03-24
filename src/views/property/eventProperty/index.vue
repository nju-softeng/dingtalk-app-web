<template>
  <div class="app-container">
    <div class="eventWrap">
      <div class="eventBox">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px;" @click="addEvent()">新建活动
        </el-button>
        <div class="eventList">
          <el-table :data="eventList" fit highlight-current-row class="tableClass">
            <el-table-column label="活动/会议名称" width="360px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="年份" width="150px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.year }}</span>
              </template>
            </el-table-column>
            <el-table-column label="活动类型" width="300px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.type }}</span>
              </template>
            </el-table-column>
            <el-table-column label="详情" align="center">
              <template slot-scope="{ row }">
                <el-button icon="el-icon-more" circle size="mini" @click="getDetail(row.id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            background
            :current-page.sync="currentPage"
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
import { listEvent, addEvent, deleteEvent } from '@/api/eventProperty'

export default {
  name: 'EventProperty',
  data() {
    return {
      total: 0,
      currentPage: 1,
      eventList: []
    }
  },
  created() {
    this.currentPage = parseInt(sessionStorage.getItem('inner-cur-page')) || 1
    this.fetchEvent(this.currentPage)
  },
  methods: {
    // 分页获取活动
    fetchEvent(page) {
      console.log(this.eventList)
      return new Promise((resolve, reject) => {
        listEvent(page, 10)
          .then(res => {
            this.eventList = res.data.list
            this.total = res.data.total
            console.log(res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 上一页
    handlePrev(val) {
      this.fetchEvent(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 下一页
    handleNext(val) {
      this.fetchEvent(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 分页获取数据
    handleCurrentChange(val) {
      this.fetchEvent(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    getDetail(id) {
      this.$router.push('/property/eventDetail/' + id)
    }
  }
}
</script>

<style scoped>
  .app-container {
    padding: 12px;
    background-color: #fafafa;
    border-radius: 0;
  }

  .eventWrap {
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .eventBox {
    background: #fff;
    padding: 10px 15px;
    min-height: 540px;
  }

  @media only screen and (min-width: 1400px) {
    .eventBox {
      max-width: 1305px !important;
    }
  }

  .eventList {
    min-height: 500px;
  }

  .pagination {
    margin-top:16px;
    display:flex;
    justify-content:center;
  }
</style>
