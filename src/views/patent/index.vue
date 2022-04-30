<template>
  <div class="app-container">
    <div class="patent-box">
      <div class="action">
        <div style="display: flex; justify-content: center; align-items: center">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addPatentDialog = true"
          >添加专利
          </el-button>
        </div>
      </div>
      <div class="list" style="height: 500px">
        <el-table :data="list" class="tableClass">
          <el-table-column label="论文信息" width="335">
            <template slot-scope="scope">
              <div class="patent-item">
                <div class="left-content">
                  <div class="title">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="scope.row.name"
                      placement="top-start"
                    >
                      <router-link
                        :to="'/patent/detail/' + scope.row.id"
                        class="link-type"
                      >
                        <svg-icon icon-class="patent" /> {{ scope.row.name }}
                      </router-link>
                    </el-tooltip>
                  </div>
                  <div class="detail">
                    <div class="journal">
                      <svg-icon icon-class="school" /> {{ scope.row.obligee }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="论文作者" align="center">
            <template slot-scope="scope">
              <div class="info-item">
                <el-tooltip
                  :disabled="scope.row.patentDetailList.length <= 3"
                  class="item"
                  effect="dark"
                  placement="top-start"
                >
                  <div slot="content">
                    <span
                      v-for="(o, index) in scope.row.patentDetailList"
                      :key="index"
                      style="padding:5px;"
                    >{{ o.name }}</span>
                  </div>
                  <div class="nameList">
                    <span
                      v-for="(o, index) in scope.row.patentDetailList"
                      :key="index"
                      style="padding:5px;"
                    >{{ o.name }}</span>
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="录用结果" align="center" width="110">
            <template slot-scope="scope">
              <div class="info-item">
                <el-tag
                  v-if="scope.row.state === 0"
                  class="patent-tag"
                >待内审</el-tag>
                <el-tag
                  v-else-if="scope.row.result === 1"
                  class="patent-tag"
                  type="danger"
                >内审不通过</el-tag>
                <el-tag
                  v-else-if="scope.row.result === 2"
                  class="patent-tag"
                  type="info"
                >内审通过</el-tag>
                <el-tag
                  v-else-if="scope.row.result === 3"
                  class="patent-tag"
                  type="danger"
                >专利授权</el-tag>
                <el-tag
                  v-else-if="scope.row.result === 4"
                  class="patent-tag"
                  type="success"
                >专利驳回</el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <div class="info-item">
                <div style="font-size:14px">
                  <el-tooltip v-if="scope.row.state === 0" effect="dark" content="内审结果" placement="top">
                    <svg-icon
                      icon-class="review"
                      @click="updatePatentReviewResult(scope.row)"
                    />
                  </el-tooltip>

                  <el-tooltip v-if="scope.row.state === 2" effect="dark" content="授权结果" placement="top">
                    <svg-icon
                      icon-class="review"
                      @click="updatePatentAuthorizationResult(scope.row)"
                    />
                  </el-tooltip>

                  <el-divider direction="vertical" />
                  <el-tooltip effect="dark" content="编辑" placement="top">
                    <svg-icon
                      icon-class="edit"
                      @click="modifyPatent(scope.row)"
                    />
                  </el-tooltip>

                  <el-divider direction="vertical" />
                  <el-tooltip effect="dark" content="删除" placement="top">
                    <svg-icon
                      icon-class="remove"
                      @click="removePatent(scope.row)"
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
    <!-- 添加专利 dialog-->
    <el-dialog
      :visible.sync="addPatentDialog"
      top="15vh"
      :lock-scroll="false"
      :width="addPatentWidth"
      center
      @closed="closeAddPatentDialog"
    >
      <div slot="title" class="header-title">
        <span class="title-age"> 添加专利 </span>
      </div>
      <div v-loading="loading">
        <div class="dialog-content">
          <div class="patent-form">
            <el-form
              ref="patentForm"
              :rules="rules"
              :model="patentForm"
              label-width="120px"
            >
              <el-form-item prop="name" style="width: 500px">
                <span slot="label"><i class="el-icon-collection" /> 专利名</span>
                <el-input
                  v-model="patentForm.name"
                  placeholder="请输入专利名"
                />
              </el-form-item>
              <file-upload v-if="patentForm.id === null" :file="file" @changeFile="changeFile" />
              <el-form-item prop="obligee">
                <span slot="label"><i class="el-icon-house" /> 权利人</span>
                <el-input
                  v-model="patentForm.obligee"
                  placeholder="请输入权利人"
                />
              </el-form-item>
              <el-form-item prop="type">
                <span slot="label"><i class="el-icon-collection-tag" /> 类型</span>
                <el-select v-model="patentForm.type" placeholder="请选择专利类型" style="width: 200px">
                  <el-option
                    v-for="(item, index) in options"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="year">
                <span slot="label"><i class="el-icon-date" /> 年份</span>
                <el-date-picker
                  v-model="patentForm.year"
                  value-format="yyyy"
                  format="yyyy年"
                  style="width: 200px"
                  type="year"
                  placeholder="专利年份"
                />
              </el-form-item>
              <el-form-item
                v-for="(author, index) in patentForm.patentDetailList"
                :key="index"
                :prop="'patentDetailList.' + index + '.uid'"
                :rules="{
                  required: true,
                  message: '请选择发明人',
                  trigger: 'change',
                }"
              >
                <span slot="label">
                  <svg-icon icon-class="people" /> 发明人
                  {{ index + 1 }}</span>

                <el-select
                  v-model="author.uid"
                  style="width: 200px"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in userList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="支持搜索功能快速查找用户"
                  placement="right"
                >
                  <span style="margin-left: 8px">
                    <svg-icon
                      icon-class="hint"
                    /></span>
                </el-tooltip>
              </el-form-item>
              <el-button
                type="text"
                style="margin-left: 20px"
                icon="el-icon-plus"
                @click="addAuthor"
              >添加发明人
              </el-button>
              <el-button
                type="text"
                style="margin-left: 20px"
                icon="el-icon-minus"
                @click="rmAuthor"
              >减少发明人</el-button>
            </el-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="submit('patentForm')"
          >确 定</el-button>
          <el-button @click="closeAddPatentDialog">取 消</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 内审结果 dialog -->
    <el-dialog
      title="内审结果"
      width="30%"
      :visible.sync="reviewResultDialog"
      :lock-scroll="false"
    >
      <div v-loading="loading" style="padding-left: 10px">
        <el-form>
          <el-form-item>
            <span slot="label">
              <svg-icon icon-class="patent" /> 内审结果 :
            </span>
            <el-radio-group v-model="reviewResultForm.result">
              <el-radio :label="1">接收</el-radio>
              <el-radio :label="0">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="reviewResultDialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitPatentReviewResult()"
          >确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 授权结果 dialog -->
    <el-dialog
      title="授权结果"
      width="30%"
      :visible.sync="authorizationResultDialog"
      :lock-scroll="false"
    >
      <div v-loading="loading" style="padding-left: 10px">
        <el-form>
          <el-form-item>
            <span slot="label">
              <svg-icon icon-class="patent" /> 授权结果 :
            </span>
            <el-radio-group v-model="authorizationResultForm.result">
              <el-radio :label="1">接收</el-radio>
              <el-radio :label="0">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="authorizationResultDialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitPatentAuthorizationResult()"
          >确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList } from '@/api/common'
import FileUpload from '@/views/patent/components/fileUpload'
import { addPatent, getPatentList, decideAudit, decideAuthorization, deletePatent } from '@/api/patent'
export default {
  name: 'Index',
  components: {
    FileUpload
  },
  data() {
    return {
      // 用户列表
      userList: [],
      total: 0,
      reviewResultDialog: false,
      authorizationResultDialog: false,
      currentPage: 1,
      addPatentDialog: false,
      list: [],
      addPatentWidth: '50%',
      file: null,
      loading: false,
      options: [{
        label: '专利',
        value: 'patent'
      }, {
        label: '软著',
        value: 'copyright'
      }],
      // 内部专利评审表单
      patentForm: {
        id: null,
        name: '',
        type: '',
        obligee: '',
        year: null,
        patentDetailList: [
          {
            num: 1,
            name: '',
            uid: null
          }
        ],
        filePath: ''
      },
      rules: {
        name: [{ required: true, message: '请输入专利名', trigger: 'blur' }],
        obligee: [{ required: true, message: '请输入权利人', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        year: [{ required: true, message: '请选择刊物/会议年份', trigger: 'blur' }],
        author: [
          { required: true, message: '请选择发明人', trigger: 'blur' }
        ],
        file: [
          {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              if (!this.file) callback(new Error('请上传专利文件'))
            }
          }
        ]
      },
      reviewResultForm: {
        patentId: '',
        result: null
      },
      authorizationResultForm: {
        patentId: '',
        result: null
      }
    }
  },
  created() {
    getUserList().then((res) => {
      this.userList = res.data
    })
    this.uid = sessionStorage.getItem('uid')
    this.role = sessionStorage.getItem('role')
    this.currentPage = parseInt(sessionStorage.getItem('inner-cur-page')) || 1
    this.fetchPatent(this.currentPage)
  },
  methods: {
    // 对象转formData 暂时没用 但是写得真好 万一要用呢
    toFormData(data) {
      const formData = new FormData()
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key])
      })
      return formData
    },
    fetchPatent(page) {
      return new Promise((resolve, reject) => {
        getPatentList(page, 6).then(res => {
          this.list = res.data.list
          this.total = res.data.total
          console.log(res.data)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 分页前一页
    handlePrev(val) {
      this.fetchPatent(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 分页下一页
    handleNext(val) {
      this.fetchPatent(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 分页当前页
    handleCurrentChange(val) {
      this.fetchPatent(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 提交内部专利评审记录
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formData = new FormData()
          if (this.file) {
            formData.append('file', this.file.raw)
          } else {
            formData.append('file', null)
          }
          this.patentForm.filePath = 'Patent' + '/' + this.patentForm.type + '/' + this.patentForm.year + '/' + this.patentForm.obligee + '/' + this.patentForm.name
          formData.append('patentVOJsonStr', JSON.stringify(this.patentForm))
          this.patentForm.file = this.file
          this.loading = true
          addPatent(formData).then(() => {
            this.addPatentDialog = false
            this.loading = false
            this.fetchPatent(1)
            this.currentPage = 1
            this.$notify({
              title: '成功',
              message: '专利提交成功',
              type: 'success'
            })
          }).catch((err) => {
            console.log(err)
            this.loading = false
            this.$message.error('创建失败')
          })
        } else {
          this.$notify({
            title: '提交失败',
            message: '请填写必要信息',
            type: 'warning'
          })
        }
      })
    },
    // 判断用户是否有修改权限
    hasAuth(patentDetailList) {
      return this.role === 'admin' ||
          this.role === 'auditor' ||
          // eslint-disable-next-line no-eval
          patentDetailList.map(item => item.uid).indexOf(eval(this.uid)) !== -1
    },
    // 更新专利状态
    updatePatentReviewResult(item) {
      this.reviewResultForm.patentId = item.id
      if (this.hasAuth(item.patentDetailList)) {
        this.reviewResultDialog = true
      } else {
        this.$message({
          message: '只有审核人，和专利发明人才可以操作',
          type: 'warning'
        })
      }
    },
    updatePatentAuthorizationResult(item) {
      this.authorizationResultForm.patentId = item.id
      if (this.hasAuth(item.patentDetailList)) {
        this.authorizationResultDialog = true
      } else {
        this.$message({
          message: '只有审核人，和专利发明人才可以操作',
          type: 'warning'
        })
      }
    },
    // 提交内审结果
    submitPatentReviewResult() {
      if (this.reviewResultForm.result !== null) {
        this.loading = true
        decideAudit(this.reviewResultForm.patentId, this.reviewResultForm).then(res => {
          this.reviewResultDialog = false
          this.fetchPatent(this.currentPage)
          this.$notify({
            title: '更新成功',
            message: '投票结果  : ' + (this.reviewResultForm.result ? 'ACCEPT' : 'REJECT'),
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
    // 提交授权结果
    submitPatentAuthorizationResult() {
      if (this.authorizationResultForm.result !== null) {
        this.loading = true
        decideAudit(this.authorizationResultForm.patentId, this.authorizationResultForm).then(res => {
          this.reviewResultDialog = false
          this.fetchPatent(this.currentPage)
          this.$notify({
            title: '更新成功',
            message: '投票结果  : ' + (this.authorizationResultForm.result ? 'ACCEPT' : 'REJECT'),
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
    // 删除论文记录
    removePatent(item) {
      if (this.hasAuth(item.patentDetailList)) {
        this.$confirm(
          '删除后，对应的AC变化和投票记录也将被删除，请谨慎操作',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          deletePatent(item.id).then(() => {
            this.fetchPatent(this.currentPage)
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
    },
    modifyPatent(form) {
      console.log(form)
      if (this.hasAuth(form.patentDetailList)) {
        this.addPatentDialog = true
        this.patentForm.id = form.id
        this.patentForm.name = form.name
        this.patentForm.applicant = form.applicant
        this.patentForm.obligee = form.obligee
        this.patentForm.type = form.type
        this.patentForm.year = form.year
        this.patentForm.patentDetailList = form.patentDetailList
      } else {
        this.$message({
          message: '只有审核人，和论文作者才可以操作',
          type: 'warning'
        })
      }
    },
    // 关闭前清空表单
    closeAddPatentDialog() {
      this.patentForm = {
        id: null,
        title: null,
        journal: null,
        patentType: null,
        isStudentFirstAuthor: true,
        patentDetailList: [
          {
            num: 1,
            name: '',
            uid: null
          }
        ]
      }
      this.addPatentDialog = false
    },
    // 添加专利发明人
    addAuthor() {
      const val = this.patentForm.patentDetailList.length + 1
      this.patentForm.patentDetailList.push({
        num: val,
        uid: ''
      })
    },
    // 移除专利发明人
    rmAuthor() {
      if (this.patentForm.patentDetailList.length !== 1) {
        this.patentForm.patentDetailList.pop()
      }
    },
    changeFile(file) {
      this.file = file
    }
  }
}
</script>

<style lang="scss" scoped>
  .action {
    margin-bottom: 5px;
    margin-right: 8px;
    display: flex;
    justify-content: space-between;
    align-content: center;
  }

  .card {
    width: 25vh;
    height: 25vh;
    margin: 10px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }

  .patent-form {
    display: flex;
  }

  .dialog-content {
    display: flex;
    justify-content: center;
  }

  .app-container {
    background-color: #fafafa;
  }

  .patent-box {
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
  }

  @media only screen and (min-width: 1400px) {
    .patent-box {
      max-width: 1305px !important;
    }
  }

  .pagination {
    margin-top:16px;
    display:flex;
    justify-content:center;
  }

  .list {
    min-height: 500px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }

  .patent-item {
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
  }

  .nameList {
    min-width: 100px;
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
