<template>
  <div>
    <div class="paper-box">
      <!-- 论文列表 -->
      <div class="list" style="height: 500px">
        <el-table :data="list" class="tableClass">
          <el-table-column label="论文信息" width="335">
            <template slot-scope="scope">
              <div class="paper-item">
                <div class="left-content">
                  <div class="title">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="scope.row.title"
                      placement="top-start"
                    >
                      <router-link
                        :to="'/paper/in-detail/' + scope.row.id + '/vote'"
                        class="link-type"
                      >
                        <svg-icon icon-class="paper" /> {{ scope.row.title }}
                      </router-link>
                    </el-tooltip>
                  </div>
                  <div class="detail">
                    <div class="journal">
                      <svg-icon icon-class="school" /> {{ scope.row.journal }}
                    </div>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="更新时间"
                      placement="top-start"
                    >
                      <div v-if="scope.row.issueDate != undefined" class="time">
                        <svg-icon icon-class="date" />
                        {{ scope.row.issueDate }}
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="论文作者" align="center">
            <template slot-scope="scope">
              <div class="info-item">
                <el-tooltip
                  :disabled="scope.row.authors.length <= 3"
                  class="item"
                  effect="dark"
                  placement="top-start"
                >
                  <div slot="content">
                    <span
                      v-for="(o, index) in scope.row.authors"
                      :key="index"
                      style="padding:5px;"
                    >{{ o.name }}</span>
                  </div>
                  <div class="namelist">
                    <span
                      v-for="(o, index) in scope.row.authors"
                      :key="index"
                      style="padding:5px;"
                    >{{ o.name }}</span>
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="投票结果" align="center" width="110">
            <template slot-scope="scope">
              <div class="info-item">
                <el-link
                  v-if="scope.row.v_status == undefined"
                  type="primary"
                  @click="newVote(scope.row)"
                >
                  发起投票</el-link>

                <router-link
                  v-else-if="scope.row.v_status == false"
                  :to="'/paper/in-detail/' + scope.row.id + '/vote'"
                  class="link-type"
                >
                  <el-link type="success"> 前往投票</el-link>
                </router-link>
                <router-link
                  v-else-if="scope.row.v_status == true"
                  :to="'/paper/in-detail/' + scope.row.id + '/vote'"
                  class="link-type"
                >
                  <el-tag
                    v-if="scope.row.v_result == true"
                    class="paper-tag"
                    type="success"
                  >ACCEPT</el-tag>
                  <el-tag v-else class="paper-tag" type="danger">REJECT</el-tag>
                </router-link>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="录用结果" align="center" width="110">
            <template slot-scope="scope">
              <div class="info-item">
                <el-tag
                  v-if="scope.row.result == 0"
                  class="paper-tag"
                >待内部投票</el-tag>
                <el-tag
                  v-else-if="scope.row.result == 1"
                  class="paper-tag"
                  type="danger"
                >未提交</el-tag>
                <el-tag
                  v-else-if="scope.row.result == 2"
                  class="paper-tag"
                  type="info"
                >审稿中</el-tag>
                <el-tag
                  v-else-if="scope.row.result == 3"
                  class="paper-tag"
                  type="danger"
                >REJECT</el-tag>
                <el-tag v-else class="paper-tag" type="success">ACCEPT</el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <div class="info-item">
                <div style="font-size:14px">
                  <el-tooltip effect="dark" content="录用结果" placement="top">
                    <svg-icon
                      icon-class="review"
                      @click="updatePaperResult(scope.row)"
                    />
                  </el-tooltip>

                  <el-divider direction="vertical" />
                  <el-tooltip effect="dark" content="编辑" placement="top">
                    <svg-icon
                      icon-class="edit"
                      @click="modifyPaper(scope.row)"
                    />
                  </el-tooltip>

                  <el-divider direction="vertical" />
                  <el-tooltip effect="dark" content="删除" placement="top">
                    <svg-icon
                      icon-class="remove"
                      @click="removePaper(scope.row)"
                    />
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
          <template slot="empty">
            <div style="height:200px;">
              <div style="margin-top:100px;">
                <svg-icon icon-class="null" style="font-size:32px" /> <br>
              </div>
              <div style="line-height: 10px;">
                <span>没有论文记录</span>
              </div>
            </div>
          </template>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          :current-page.sync="currentPage"
          :hide-on-single-page="total < 6 ? true : false"
          small
          layout="prev, pager, next"
          :total="total"
          :page-size="6"
          @prev-click="handlePrev"
          @next-click="handleNext"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 投稿结果  dialog -->
    <el-dialog
      title="录用结果"
      width="30%"
      :visible.sync="resultDialog"
      :lock-scroll="false"
    >
      <div v-loading="loading" style="padding-left: 10px">
        <el-form>
          <el-form-item>
            <span slot="label">
              <svg-icon icon-class="paper" /> 接收情况 :
            </span>
            <el-radio-group v-model="resultForm.result">
              <el-radio :label="true">接收</el-radio>
              <el-radio :label="false">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              <svg-icon icon-class="paper" /> 确认时间 :
            </span>
            <el-date-picker
                value-format="yyyy-MM-dd"
              v-model="resultForm.updateDate"
              style="width:193px"
              type="date"
              placeholder="选择日期"
            />

          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="resultDialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitPaperResult()"
          >确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 发起投票  dialog -->
    <el-dialog
      title="发起投票"
      :visible.sync="voteDialog"
      :lock-scroll="false"
      width="30%"
      top="24vh"
    >
      <div v-loading="loading">
        <el-form ref="voteform" :model="voteform">
          <el-form-item
            prop="endTime"
            :rules="{
              required: true,
              message: '请选择截止时间',
              trigger: 'change'
            }"
          >
            <span slot="label">截止时间 </span>
            <el-time-picker
              v-model="voteform.endTime"
              arrow-control
              value-format="HH:mm"
              format="HH:mm"
              :picker-options="{
                selectableRange: '07:00:00 - 21:30:00'
              }"
              placeholder="选择时间"
            />
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="voteDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitvote">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList } from '@/api/common'

import {
  listPaper,
  createVote,
  submitResult,
  rmPaper
} from '@/api/paper'

const levels = [
  {
    value: 'JOURNAL_A',
    label: 'Journal A'
  },
  {
    value: 'CONFERENCE_A',
    label: 'Conference A'
  },
  {
    value: 'JOURNAL_B',
    label: 'Journal B'
  },
  {
    value: 'CONFERENCE_B',
    label: 'Conference B'
  },
  {
    value: 'JOURNAL_C',
    label: 'Journal C'
  },
  {
    value: 'CONFERENCE_C',
    label: 'Conference C'
  }
]

export default {
  name: 'PaperInternal',
  data() {
    return {
      userlist: [],
      total: 0,
      resultDialog: false,
      state: '',
      currentPage: 1,
      voteform: {
        paperid: '',
        endTime: ''
      },
      options: levels,
      list: [],
      loading: false,
      voteDialog: false,
      uid: '',
      role: '',
      resultForm: {
        paperid: '',
        result: null,
        updateDate: null
      }
    }
  },
  created() {
    getUserList().then(res => {
      this.userlist = res.data
    })
    this.currentPage = parseInt(sessionStorage.getItem('inner-cur-page')) || 1
    this.fetchPaper(this.currentPage)
    this.uid = sessionStorage.getItem('uid')
    this.role = sessionStorage.getItem('role')
    this.$message({
      showClose: true,
      duration: 1000,
      message: '点击论文标题可以查看详情'
    })
  },
  methods: {
    // 分页获取论文信息
    fetchPaper(page) {
      return new Promise((resolve, reject) => {
        listPaper(page, 6)
          .then(res => {
            this.list = res.data.list
            this.total = res.data.total
            console.log(res.data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 分页前一页
    handlePrev(val) {
      this.fetchPaper(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 分页下一页
    handleNext(val) {
      this.fetchPaper(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 分页当前页
    handleCurrentChange(val) {
      this.fetchPaper(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 创建投票，唤起dialog
    newVote(item) {
      this.voteform.paperid = item.id
      if (item.vote === undefined) {
        console.log(item)
        this.voteDialog = true
      } else {
        this.$router.push({
          path: '/paper/vote/' + item.id
        })
      }
    },
    // 提交新创建的投票
    submitvote() {
      this.$refs.voteform.validate(valid => {
        if (valid) {
          this.loading = true
          createVote(this.voteform)
            .then(() => {
              this.voteDialog = false
              this.$notify({
                message: '发起投票成功',
                type: 'success'
              })
              this.$router.push({
                path: '/paper/in-detail/' + this.voteform.paperid + '/vote'
              })
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    // 判断用户是否有修改论文记录的权限
    hasAuth(authors) {
      if (
        this.role === 'admin' ||
        this.role === 'auditor' ||
        authors.map(item => item.uid).indexOf(eval(this.uid)) !== -1
      ) {
        return true
      } else {
        return false
      }
    },
    // 更新论文投稿结果, 唤醒dialog
    updatePaperResult(item) {
      this.resultForm.paperid = item.id
      if (this.hasAuth(item.authors)) {
        this.resultDialog = true
      } else {
        this.$message({
          message: '只有审核人，和论文作者才可以操作',
          type: 'warning'
        })
      }
    },
    // 提交论文投稿结果
    submitPaperResult() {
      if (this.resultForm.result !== null && this.resultForm.updateDate !== null) {
        this.loading = true
        submitResult(this.resultForm.paperid, this.resultForm)
          .then(res => {
            this.resultDialog = false
            this.fetchPaper(this.currentPage)
            this.$notify({
              title: '更新成功',
              message: '投票结果  : ' + (this.resultForm.result ? 'ACCEPT' : 'REJECT'),
              type: 'success'
            })
          }).catch(err => {
            this.$message({
              message: err.message,
              type: 'warning'
            })
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.$message({
          message: '请选择结果',
          type: 'warning'
        })
      }
    },
    // 修改论文记录
    modifyPaper(item) {
      if (this.hasAuth(item.authors)) {
        this.$emit('modifyInternal', item)
      } else {
        this.$message({
          message: '只有审核人，和论文作者才可以操作',
          type: 'warning'
        })
      }
    },
    // 删除论文记录
    removePaper(item) {
      if (this.hasAuth(item.authors)) {
        this.$confirm(
          '删除后，对应的AC变化和投票记录也将被删除，请谨慎操作',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            rmPaper(item.id).then(() => {
              this.fetchPaper(this.currentPage)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.$message({
          message: '只有审核人，和论文作者才可以操作',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  margin-top:16px;
  display:flex;
  justify-content:center;
}

.tableClass {
  /deep/ .el-table__fixed-right {
    height: calc(100% - 11px) !important; //设置高优先，以覆盖内联样式
  }
  /deep/ .el-table__fixed-right::before {
    height: 0px !important; //设置高优先，以覆盖内联样式
  }
}

.list {
  min-height: 500px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.paper-item {
  padding: 3px 12px 3px 0;
  border-width: 0 0 1px 0;
  .left-content {
    font-size: 13px;
    display: flex;
    flex-direction: column;
    .title {
      a {
        color: #0366d6;
      }
      color: #409eff;
      font-weight: 500;
      margin-bottom: 5px;
      width: 330px;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .detail {
      display: flex;
      color: gray;
      font-size: 13px;
      padding-top: 7px;
      .journal {
        width: 180px;
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .time {
        padding-left: 5px;
      }
    }
  }
  //
  //.info-item {
  //  color: gray;
  //  display: flex;
  //  justify-content: flex-start;
  //  font-size: 13px;
  //  align-items: center;
  //}
}

.namelist {
  min-width: 100px;
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>
