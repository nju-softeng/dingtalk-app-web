<template>
  <div>
    <el-row :gutter="10" style="min-height: 500px;">
      <el-col v-for="(item,index) in list" :key="index" :xs="24" :sm="8" :md="6" :lg="6">
        <div class="card">
          <div style="cursor:pointer;" @click="goDetail(item.id)">
            <div class="title" style="min-height: 53px">
              {{ item.title }}
            </div>
            <div v-if="item.vote.result === undefined " class="info">
              <div class="info-item">投票时间</div>
              <div class="info-item">{{ item.vote.startTime | parseTime("{h}:{i}") }} ~ {{ item.vote.endTime | parseTime("{h}:{i}") }}</div>
            </div>
            <div v-else class="info">
              <div class="info-item">
                <span>投票意见 : </span>
                <span>
                  <el-tag v-if="item.vote.result === true" class="tag" type="success">ACCEPT</el-tag>
                  <el-tag v-else class="tag" type="danger">REJECT</el-tag>
                </span>
              </div>
              <div class="info-item">
                <span>录用结果 : </span>
                <span>
                  <el-tag v-if="item.result === undefined" class="tag" type="success">等待中</el-tag>
                  <el-tag v-else-if="item.result === true" class="tag" type="success">ACCEPT</el-tag>
                  <el-tag v-else class="tag" type="danger">REJECT</el-tag>
                </span>
              </div>
            </div>
          </div>

          <div class="action" style=" display:flex; justify-content: space-between; align-items: center; padding-right: 16px; padding-left: 16px">
            <div style="font-size: 12px;color: gray;">
              更新日期：{{item.updateDate || '未设置'}}
            </div>
            <div style="display: flex">
              <el-button circle plain type="primary" icon="el-icon-check" @click="showPaperResultDialog(item)" />
              <el-button circle plain type="primary" icon="el-icon-edit" @click="modifyExPaper(item)" />
              <el-button circle plain type="danger" icon="el-icon-delete" @click="rmExPaper(item.id)" />
            </div>

          </div>
        </div>
      </el-col>
    </el-row>
    <div v-if="list.length === 0" style="height:200px;text-align:center;margin-top: 180px">
      <svg-icon icon-class="null" style="font-size:32px" />
      <div style="font-size: 11px; color: #97a8be">空空如也~</div>
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
              v-model="resultForm.updateDate"
              value-format="yyyy-MM-dd"
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
  </div>
</template>

<script>
import { listExPaper, deleteExPaper, addExpaperResult } from '@/api/ex-paper'

export default {
  name: 'PaperExternal',
  data() {
    return {
      list: [],
      role: null,
      resultDialog: false,
      loading: false,
      resultForm: {
        paperId: '',
        result: null,
        updateDate: null
      }
    }
  },
  created() {
    this.fetchExPaper()
    this.role = sessionStorage.getItem('role')
  },
  methods: {
    goDetail(id) {
      this.$router.push({
        path: '/paper/ex-detail/' + id + '/vote'
      })
    },
    fetchExPaper() {
      listExPaper().then(res => {
        this.list = res.data
        console.log(this.list)
      })
    },
    // 是否有审核权限
    hasAuth() {
      if (this.role === 'admin' || this.role === 'auditor') {
        return true
      } else {
        return false
      }
    },
    // 修改论文记录
    modifyExPaper(item) {
      if (this.hasAuth()) {
        this.$emit('modifyExternal', item)
      } else {
        this.$message({
          message: '只有审核人才可以操作',
          type: 'warning'
        })
      }
    },
    // 删除外部评审论文
    rmExPaper(id) {
      if (!this.hasAuth()) {
        this.$message({
          message: '只有审核人才可以操作',
          type: 'warning'
        })
        return
      }
      this.$confirm('对应的投票和AC记录也会被删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteExPaper(id).then(() => {
          this.fetchExPaper()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 更新论文投稿结果, 唤醒dialog
    showPaperResultDialog(item) {
      this.resultForm.paperId = item.id
      if (this.hasAuth()) {
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
        addExpaperResult(this.resultForm.paperId, this.resultForm)
          .then(res => {
            this.resultDialog = false
            this.fetchExPaper()
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
    }
  }
}
</script>

<style lang="scss" scoped>
.tag {
  line-height:14px;
  height:14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.card {
  margin-bottom:10px;
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #FFFFFF;
  .title {
    padding: 16px 16px 1px;
  }
  .info {
    height: 64px;
    .info-item {
      text-align:center;
      padding-top:10px;
      font-size: 13px;
    }
  }
  .action {
    height: 40px;
    border-top: 1px solid #e6ebf5;
    //background: #e5e9f2;
  }

}

.title {
  overflow:hidden;
  text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
}
.box-card {
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
