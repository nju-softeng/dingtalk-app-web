<template>
  <div class="app-container">
    <div class="reimburseWrap">
      <div class="reimburseBox">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px;" @click="currentOperation='添加报销'; addReimburseDialogVisible=true">新建报销记录
        </el-button>
        <div class="reimburseList">
          <el-table :data="reimburseList" fit highlight-current-row class="tableClass">
            <el-table-column label="报销名称" width="460px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="类型" width="150px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.type }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="150px" align="center">
              <template slot-scope="{ row }">
                <el-tag
                  v-if="row.state === -1"
                  class="reimburseTag"
                  type="info"
                >未审核</el-tag>
                <el-tag
                  v-else-if="row.state === 0"
                  class="reimburseTag"
                >审核中</el-tag>
                <el-tag
                  v-else-if="row.state === 1"
                  class="reimburseTag"
                  type="success"
                >审核通过</el-tag>
                <el-tag
                  v-else-if="row.state === 2"
                  class="reimburseTag"
                  type="danger"
                >审核不通过</el-tag>
                <el-tag
                  v-else
                  class="reimburseTag"
                  type="danger"
                >{{ row.state }}未知状态</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="报销人" width="200px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.user.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="150px" fixed="right" align="center">
              <template slot-scope="{ row }">
                <el-tooltip
                  effect="dark"
                  content="详情"
                  placement="top"
                >
                  <el-button class="detailBtn" icon="el-icon-more" size="mini" @click="getDetail(row.id)" />
                </el-tooltip>
                <el-tooltip
                  v-show="row.user.id === uid && row.state === -1"
                  effect="dark"
                  content="编辑"
                  placement="top"
                >
                  <el-button class="modifyBtn" type="primary" icon="el-icon-s-operation" size="mini" @click="modifyReimburse(row)" />
                </el-tooltip>
                <el-button v-show="row.user.id !== uid || row.state === 0 || row.state === 1" class="modifyBtn" type="primary" icon="el-icon-s-operation" size="mini" disabled />
                <el-tooltip
                  v-show="row.user.id === uid"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <el-button class="deleteBtn" type="danger" icon="el-icon-delete-solid" size="mini" @click="deleteWholeReimburse(row.id)" />
                </el-tooltip>
                <el-button v-show="row.user.id !== uid" class="deleteBtn" type="danger" icon="el-icon-delete-solid" size="mini" disabled />
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
    <el-dialog
      :title="currentOperation"
      :visible.sync="addReimburseDialogVisible"
      width="30%"
      :before-close="clearBeforeClose"
    >
      <el-form ref="addReimburseForm" :model="addReimburseForm" :rules="rules" label-width="100px" style="margin-left: 36px">
        <el-form-item prop="name" label="报销名称:">
          <el-col :span="12">
            <el-input v-model="addReimburseForm.name" placeholder="请输入报销名称" style="width: 200px" />
          </el-col>
        </el-form-item>
        <el-form-item prop="type" label="报销类型:">
          <el-col :span="12">
            <el-select
              v-model="addReimburseForm.type"
              placeholder="选择报销类型"
              style="width: 200px"
            >
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancelAddReimburse">取 消</el-button>
        <el-button type="primary" @click="addNewReimburse('addReimburseForm')">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getReimbursementList, deleteReimbursement, addReimbursement } from '@/api/reimburse'
export default {
  name: 'Index',
  data() {
    return {
      total: 0,
      currentPage: 1,
      reimburseList: [],
      addReimburseDialogVisible: false,
      currentOperation: '添加报销',
      options: [{
        label: '差旅报销',
        value: '差旅报销'
      }, {
        label: '国内会议报销',
        value: '国内会议报销'
      }, {
        label: '国际会议报销',
        value: '国际会议报销'
      }, {
        label: '办公用品报销',
        value: '办公用品报销'
      }],
      addReimburseForm: {
        id: null,
        name: '',
        type: null,
        path: ''
      },
      rules: {
        name: [{ required: true, message: '请输入报销名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择报销类型', trigger: 'blur' }]
      },
      uid: -1
    }
  },
  created() {
    this.currentPage = parseInt(sessionStorage.getItem('inner-cur-page')) || 1
    this.fetchReimburse(this.currentPage)
    this.uid = parseInt(sessionStorage.getItem('uid'))
  },
  methods: {
    // 分页获取报销
    fetchReimburse(page) {
      console.log(this.reimburseList)
      return new Promise((resolve, reject) => {
        getReimbursementList(page, 10)
          .then(res => {
            this.reimburseList = res.data.list
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
      this.fetchReimburse(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 下一页
    handleNext(val) {
      this.fetchReimburse(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 分页获取数据
    handleCurrentChange(val) {
      this.fetchReimburse(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    getDetail(id) {
      this.$router.push('/reimburse/detail/' + id)
    },
    deleteWholeReimburse(id) {
      deleteReimbursement(id).then(() => {
        this.$message.success('删除成功')
        this.fetchReimburse(this.currentPage)
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },
    addNewReimburse(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addReimburseForm.path = 'Reimburse/' + this.addReimburseForm.type + '/' + this.addReimburseForm.name
          addReimbursement(this.addReimburseForm).then(() => {
            if (this.currentOperation === '添加报销') {
              this.$message.success('添加成功')
            } else if (this.currentOperation === '修改报销') {
              this.$message.success('修改成功')
            } else {
              this.$message.error('未知的状态！')
            }
            this.cancelAddReimburse()
            this.fetchReimburse(this.currentPage)
          }).catch(err => {
            if (this.currentOperation === '添加报销') {
              this.$message.error('添加失败')
            } else if (this.currentOperation === '修改报销') {
              this.$message.error('修改失败')
            } else {
              this.$message.error('未知的状态！')
            }
            console.log(err)
          })
        } else {
          this.$notify({
            title: '添加失败',
            message: '请填写必要信息',
            type: 'warning'
          })
        }
      })
    },
    modifyReimburse(row) {
      this.currentOperation = '修改报销'
      this.addReimburseForm.id = row.id
      this.addReimburseForm.name = row.name
      this.addReimburseForm.type = row.type
      this.addReimburseDialogVisible = true
    },
    clearBeforeClose(done) {
      this.addReimburseForm = {
        id: null,
        name: '',
        type: null,
        path: ''
      }
      return done(true)
    },
    cancelAddReimburse() {
      this.addReimburseDialogVisible = false
      this.addReimburseForm = {
        id: null,
        name: '',
        type: null,
        path: ''
      }
    }
  }
}
</script>

<style scoped>

  .app-container {
    display: flex;
    align-content: center;
    padding: 0 12px;
    background-color: #fafafa;
    border-radius: 0;
  }

  .reimburseWrap {
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    width: 80%;
  }

  .reimburseBox {
    background: #fff;
    padding: 10px 15px;
    min-height: 540px;
  }

  @media only screen and (min-width: 1400px) {
    .reimburseBox {
      max-width: 1305px !important;
    }
  }

  .reimburseList {
    min-height: 500px;
  }

  .pagination {
    margin-top:16px;
    display:flex;
    justify-content:center;
  }

  .detailBtn {
    padding: 2px 6px;
    border-radius: 5px;
  }

  .modifyBtn {
    padding: 2px 6px;
    border-radius: 5px;
    margin-left: 16px;
  }

  .deleteBtn {
    padding: 2px 6px;
    border-radius: 5px;
    margin-left: 16px;
  }
</style>
