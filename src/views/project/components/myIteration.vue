<template>
  <div>
    <div style="margin-bottom:5px">
      <el-radio-group v-model="radio" size="mini" @change="changeRadio">
        <el-radio-button label="进行中" />
        <el-radio-button label="已结束" />
        <el-radio-button label="全部" />
      </el-radio-group>
    </div>
    <el-table v-loading="loading" :show-header="false" :data="list" class="tableClass">
      <el-table-column width="250">
        <template slot-scope="scope">
          <div style="height:80px; display:flex; justify-content: center; flex-direction:column;">
            <div>
              <span class="title">
                {{ scope.row.project.title }}
              </span>
              <el-tag>第{{ scope.row.cnt }}次迭代</el-tag>
            </div>
            <div>
              <i class="el-icon-time" />
              <span style="margin-left: 10px">{{ scope.row.beginTime | formatDate }} ~
                {{ scope.row.endTime | formatDate }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column min-width="80px">
        <template slot-scope="scope">
          <div>
            <span>预期AC </span>
          </div>
          <div>
            {{ scope.row.expectedAC }}
          </div>
        </template>
      </el-table-column>

      <el-table-column v-if="radio != '进行中'" align="center" min-width="200px">
        <template slot-scope="scope">
          <div>
            完成时间
          </div>
          <template v-if="scope.row.status == false">
            <el-tag type="info">进行中</el-tag>
          </template>
          <template v-else>
            <el-tag v-if="scope.row.finishTime <= scope.row.endTime" type="success">
              <i class="el-icon-time" />
              {{ scope.row.finishTime }} 按时完成</el-tag>
            <el-tag v-else type="danger">
              {{ scope.row.finishTime }} 延期完成
            </el-tag>
          </template>
        </template>
      </el-table-column>

      <el-table-column min-width="320">
        <template slot-scope="scope">
          <div>
            <div style="padding-left:10px">开发者</div>
            <div style="min-width:300px;">
              <template v-if="scope.row.status == false">
                <el-tag v-for="(o, index) in scope.row.iterationDetails" :key="index" style="margin:0 4px" effect="plain" size="small">{{ o.user.name }}</el-tag>
              </template>
              <template v-else>
                <el-tag v-for="(o, index) in scope.row.iterationDetails" :key="index" style="margin:0 4px" effect="plain" size="small">{{ o.user.name }} AC: {{ o.ac }}</el-tag>
              </template>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column fixed="right" min-width="120">
        <template slot-scope="scope">
          ---(设计中)
        </template>
      </el-table-column>

      <template slot="empty">
        <div style="height:200px;">
          <div style="margin-top:100px;">
            <svg-icon icon-class="null" style="font-size:32px" /> <br>
          </div>
          <div style="line-height: 10px;">
            <span>没有迭代记录</span>
          </div>
        </div>
      </template>
    </el-table>
  </div>
</template>
<script>
import { listUserIteration } from '@/api/project.js'

export default {
  data() {
    return {
      loading: false,
      radio: '进行中',
      list: [],
      donelist: [],
      undonelist: []
    }
  },
  created() {
    this.fetchIteration()
  },
  methods: {
    // 查询用户迭代数据
    fetchIteration() {
      listUserIteration().then(res => {
        this.totallist = res.data
        this.donelist = res.data.filter(item => item.status)
        this.undonelist = res.data.filter(item => !item.status)
        if (this.radio == '进行中') {
          this.list = this.undonelist
        } else if (this.radio == '已结束') {
          this.list = this.donelist
        } else {
          this.list = this.totallist
        }
      })
    },
    changeRadio(val) {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 500)
      if (val == '进行中') {
        this.list = this.undonelist
      } else if (val == '已结束') {
        this.list = this.donelist
      } else {
        this.list = this.totallist
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tableClass {
  ::v-deep .el-table__fixed-right {
    height: calc(100% - 11px) !important; //设置高优先，以覆盖内联样式
  }
  ::v-deep .el-table__fixed-right::before {
    height: 0px !important; //设置高优先，以覆盖内联样式
  }
  border-top: 0.5px solid #f0f0f0;
}

.title {
  margin-right: 5px;
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
