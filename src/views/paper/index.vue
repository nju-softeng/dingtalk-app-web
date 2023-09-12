<template>
  <div class="app-container">
    <div class="paper-box">
      <div class="action">
        <!--导航栏-->
        <tabs v-model="activeTab">
          <tab-pane label="组内评审" name="paperInternal" />
          <tab-pane label="组外评审" name="paperExternal" />
          <tab-pane label="非学生一作" name="paperByProfessor" />
        </tabs>
        <!--添加按钮-->
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addReviewDialog = true"
          >添加论文
          </el-button>
        </div>
      </div>
      <component
        :is="activeTab"
        ref="reviewTab"
        @modifyInternal="modifyInternalReview"
        @modifyExternal="modifyExternalReview"
        @modifyProfessor="modifyProfessorReview"
      />
    </div>

    <!-- 添加评审记录  dialog -->
    <el-dialog
      :visible.sync="addReviewDialog"
      top="15vh"
      :lock-scroll="false"
      center
      width="400px"
      @closed="closeAddReviewDialog"
    >
      <!-- dialog 标题 -->
      <div slot="title" class="header-title">
        <span class="title-age"> {{ addReviewDialogTitle }} </span>
      </div>
      <!-- 评审类型选择菜单 -->
      <div v-if="addReviewContent === undefined" class="dialog-content">
        <el-card
          shadow="hover"
          class="card"
          @click.native="addReviewContent = 'internalReview'"
        >
          <div>内部评审</div>
        </el-card>
        <el-card
          shadow="hover"
          class="card"
          @click.native="addReviewContent = 'externalReview'"
        >
          <div>外部评审</div>
        </el-card>
        <el-card
          shadow="hover"
          class="card"
          @click.native="addReviewContent = 'paperByProfessorReview'"
        >
          <div>非学生一作</div>
        </el-card>
      </div>
      <div v-else>
        <!-- 添加内部评审 -->
        <div v-if="addReviewContent === 'internalReview'" v-loading="loading">
          <div class="dialog-content">
            <div class="paper-form">
              <el-form
                ref="internalPaperForm"
                :rules="rules"
                :model="internalPaperForm"
                width="300px"
              >
                <el-form-item prop="title" style="width: inherit">
                  <span slot="label">
                    <svg-icon icon-class="paper" /> 论文名称</span>
                  <el-input
                    v-model="internalPaperForm.title"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                  />
                </el-form-item>
                <file-upload
                  v-if="internalPaperForm.id === null"
                  :file="file"
                  @changeFile="changeFile"
                />
                <el-form-item prop="journal">
                  <span slot="label">
                    <svg-icon icon-class="school" /> 刊物/会议</span>
                  <el-input
                    v-model="internalPaperForm.journal"
                    type="textarea"
                    :rows="1"
                    placeholder="请输入内容"
                  />
                </el-form-item>
                <el-form-item prop="year">
                  <span slot="label"><i class="el-icon-date" /> 年份</span>
                  <el-date-picker
                    v-model="internalPaperForm.year"
                    value-format="yyyy"
                    format="yyyy年"
                    style=""
                    type="year"
                    placeholder="刊物/会议年份"
                  />
                </el-form-item>
                <el-form-item prop="paperType">
                  <span slot="label">
                    <svg-icon icon-class="grade" /> 论文分类</span>
                  <el-select
                    v-model="internalPaperForm.paperType"
                    style=""
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in options"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item prop="theme">
                  <span
                    slot="label"
                  ><i class="el-icon-collection-tag" /> 主题</span>
                  <el-input
                    v-model="internalPaperForm.theme"
                    placeholder="请输入论文主题"
                    style=""
                  />
                </el-form-item>
                <el-form-item
                  v-for="(author, index) in internalPaperForm.authors"
                  :key="index"
                  :prop="'authors.' + index + '.uid'"
                  :rules="{
                    required: true,
                    message: '请选择学生作者',
                    trigger: 'change',
                  }"
                >
                  <span slot="label">
                    <svg-icon icon-class="people" /> 学生作者
                    {{ index + 1 }}</span>

                  <el-select
                    v-model="author.uid"
                    style=""
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in userlist"
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
                >添加作者
                </el-button>
                <el-button
                  type="text"
                  style="margin-left: 20px"
                  icon="el-icon-minus"
                  @click="rmAuthor"
                >减少作者</el-button>
              </el-form>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              @click="submit('internalPaperForm')"
            >确 定</el-button>
            <el-button
              v-if="internalPaperForm.id === null"
              @click="closeAddReviewDialog"
            >取 消</el-button>
            <el-button v-else @click="addReviewDialog = false">取 消</el-button>
          </span>
        </div>
        <!-- 添加外部评审 -->
        <div v-if="addReviewContent === 'externalReview'" v-loading="loading">
          <div class="dialog-content">
            <div class="paper-form">
              <el-form
                ref="externalPaperForm"
                :rules="rules"
                :model="externalPaperForm"
              >
                <el-form-item prop="title">
                  <span slot="label">
                    <svg-icon icon-class="paper" /> 论文名称</span>
                  <el-input
                    v-model="externalPaperForm.title"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                  />
                </el-form-item>
                <el-form-item prop="theme">
                  <span
                    slot="label"
                  ><i class="el-icon-collection-tag" /> 主题</span>
                  <el-input
                    v-model="externalPaperForm.theme"
                    placeholder="请输入论文主题"
                    style=""
                  />
                </el-form-item>
                <file-upload
                  v-if="externalPaperForm.id === null"
                  :file="file"
                  @changeFile="changeFile"
                />
                <el-form-item prop="period">
                  <span slot="label">
                    <svg-icon icon-class="school" /> 投票时间</span>
                  <el-time-picker
                    v-model="externalPaperForm.period"
                    value-format="yyyy-MM-ddTHH:mm:ss"
                    format="HH:mm"
                    is-range
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围"
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              @click="addExternalReview('externalPaperForm')"
            >确 定</el-button>
            <el-button
              v-if="externalPaperForm.id === null"
              @click="closeAddReviewDialog"
            >取 消</el-button>
            <el-button v-else @click="addReviewDialog = false">取 消</el-button>
          </span>
        </div>
        <!-- 添加非学生一作 -->
        <div
          v-if="addReviewContent === 'paperByProfessorReview'"
          v-loading="loading"
        >
          <div class="dialog-content">
            <div class="paper-form">
              <el-form
                ref="professorPaperForm"
                :rules="rules"
                :model="professorPaperForm"
              >
                <el-form-item prop="title" style="">
                  <span slot="label">
                    <svg-icon icon-class="paper" /> 论文名称</span>
                  <el-input
                    v-model="professorPaperForm.title"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                  />
                </el-form-item>
                <file-upload
                  v-if="professorPaperForm.id === null"
                  :file="file"
                  @changeFile="changeFile"
                />
                <el-form-item prop="journal">
                  <span slot="label">
                    <svg-icon icon-class="school" /> 刊物/会议</span>
                  <el-input
                    v-model="professorPaperForm.journal"
                    type="textarea"
                    :rows="1"
                    placeholder="请输入内容"
                  />
                </el-form-item>
                <el-form-item prop="year">
                  <span slot="label"><i class="el-icon-date" /> 年份</span>
                  <el-date-picker
                    v-model="professorPaperForm.year"
                    value-format="yyyy"
                    format="yyyy年"
                    style=""
                    type="year"
                    placeholder="刊物/会议年份"
                  />
                </el-form-item>
                <el-form-item prop="paperType">
                  <span slot="label">
                    <svg-icon icon-class="grade" /> 论文分类</span>
                  <el-select
                    v-model="professorPaperForm.paperType"
                    style=""
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in options"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item prop="theme">
                  <span
                    slot="label"
                  ><i class="el-icon-collection-tag" /> 主题</span>
                  <el-input
                    v-model="professorPaperForm.theme"
                    placeholder="请输入论文主题"
                    style=""
                  />
                </el-form-item>
                <el-form-item prop="firstAuthor" style="">
                  <span slot="label">
                    <svg-icon icon-class="paper" /> 第一作者</span>
                  <el-input
                    v-model="professorPaperForm.firstAuthor"
                    style=""
                    placeholder="请输入第一作者"
                  />
                </el-form-item>
                <el-form-item
                  v-for="(author, index) in professorPaperForm.authors"
                  :key="index"
                  :prop="'authors.' + index + '.uid'"
                  :rules="{
                    required: true,
                    message: '请选择学生作者',
                    trigger: 'change',
                  }"
                >
                  <span slot="label">
                    <svg-icon icon-class="people" /> 学生作者
                    {{ index + 1 }}</span>

                  <el-select
                    v-model="author.uid"
                    style=""
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in userlist"
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
                  @click="addNonFirstAuthor"
                >添加作者
                </el-button>
                <el-button
                  type="text"
                  style="margin-left: 20px"
                  icon="el-icon-minus"
                  @click="rmNonFirstAuthor"
                >减少作者</el-button>
              </el-form>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              @click="submit('professorPaperForm')"
            >确 定</el-button>
            <el-button
              v-if="professorPaperForm.id === null"
              @click="closeAddReviewDialog"
            >取 消</el-button>
            <el-button v-else @click="addReviewDialog = false">取 消</el-button>
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUserList } from '@/api/common'
import Tabs from '@/components/TabNav/tabs'
import TabPane from '@/components/TabNav/tabpane'
import FileUpload from '@/views/paper/components/fileUpload'
import paperExternal from '@/views/paper/externalPaper'
import paperInternal from '@/views/paper/internalPaper'
import paperByProfessor from '@/views/paper/paperByProfessor'
import { addPaper } from '@/api/paper'

import { addExReview } from '@/api/ex-paper'

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
  },
  {
    value: 'Non_CCF',
    label: 'Non_CCF'
  }
]

export default {
  components: {
    FileUpload,
    Tabs,
    TabPane,
    paperExternal,
    paperInternal,
    paperByProfessor
  },
  data() {
    return {
      // 当前激活的选项卡，默认是 paperInternal
      activeTab: 'paperInternal',
      // 用户列表
      userlist: [],
      //
      addReviewDialog: false,
      addReviewWidth: '400px',
      addReviewContent: undefined,
      addReviewDialogTitle: '请选择评审类型',
      file: null,
      loading: false,
      options: levels,
      // 内部论文评审表单
      internalPaperForm: {
        id: null,
        title: null,
        journal: null,
        year: null,
        theme: null,
        paperType: null,
        isStudentFirstAuthor: true,
        authors: [
          {
            num: 1,
            name: '',
            uid: null
          }
        ],
        path: ''
      },
      // 内部论文评审表单
      externalPaperForm: {
        id: null,
        title: null,
        file: null,
        theme: null,
        period: '',
        path: ''
      },
      professorPaperForm: {
        id: null,
        title: null,
        journal: null,
        paperType: null,
        firstAuthor: null,
        isStudentFirstAuthor: false,
        authors: [
          {
            num: 1,
            name: '',
            uid: null
          }
        ],
        path: ''
      },

      rules: {
        title: [{ required: true, message: '请输入论文名称', trigger: 'blur' }],
        journal: [
          { required: true, message: '请输入刊物/会议', trigger: 'blur' }
        ],
        year: [
          { required: true, message: '请选择刊物/会议年份', trigger: 'blur' }
        ],
        theme: [{ required: true, message: '请输入主题', trigger: 'blur' }],
        author: [
          { required: true, message: '请输入第一作者', trigger: 'blur' }
        ],
        firstAuthor: [
          { required: true, message: '请输入第一作者', trigger: 'blur' }
        ],
        paperType: [
          { required: true, message: '请选择论文分类', trigger: 'change' }
        ],
        period: [
          { required: true, message: '请选择起止时间', trigger: 'blur' }
        ],
        file: [
          {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              if (!this.file) callback(new Error('请上传论文文件'))
            }
          }
        ]
      }
    }
  },
  watch: {
    addReviewContent(val) {
      if (val === 'internalReview') {
        this.addReviewDialogTitle = '内部评审'
        this.addReviewWidth = '64%'
      } else if (val === 'externalReview') {
        this.addReviewDialogTitle = '外部评审'
        this.addReviewWidth = '58%'
      } else if (val === 'paperByProfessorReview') {
        this.addReviewDialogTitle = '非学生一作'
        this.addReviewWidth = '58%'
      } else {
        this.addReviewDialogTitle = '请选择评审类型'
        this.addReviewWidth = '52%'
      }
    }
  },
  created() {
    // 根据路由的参数选择显示的tab
    if (this.$route.params.type === 'external') {
      this.activeTab = 'paperExternal'
    } else if (this.$route.params.type === 'internal') {
      this.activeTab = 'paperInternal'
    } else if (this.$route.params.type === 'paperByProfessor') {
      this.activeTab = 'paperByProfessor'
    }
    getUserList().then((res) => {
      this.userlist = res.data
    })

    this.uid = parseInt(sessionStorage.getItem('uid'))
    this.role = sessionStorage.getItem('role')
  },
  methods: {
    // 对象转formData
    toFormData(data) {
      const formData = new FormData()
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key])
      })
      return formData
    },
    // 提交内部论文评审记录
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formData = new FormData()
          if (this.file) {
            formData.append('file', this.file.raw)
          }
          if (formName === 'internalPaperForm') {
            this.internalPaperForm.path =
              'Property/Academic/Literature/' +
              this.internalPaperForm.journal +
              this.internalPaperForm.year +
              '/' +
              this.internalPaperForm.theme
            formData.append(
              'paperFormJsonStr',
              JSON.stringify(this.internalPaperForm)
            )
            this.internalPaperForm.file = this.file
            this.loading = true
            addPaper(formData)
              .then(() => {
                this.addReviewDialog = false
                this.loading = false
                if (this.activeTab === 'paperInternal') {
                  this.$refs.reviewTab.fetchPaper(1)
                  this.$refs.reviewTab.currentPage = 1
                } else {
                  this.activeTab = 'paperInternal'
                }
                this.$notify({
                  title: '成功',
                  message: '论文记录提交成功',
                  type: 'success'
                })
              })
              .catch((err) => {
                console.log(err)
                this.loading = false
                this.$message.error('创建失败')
              })
          } else {
            this.professorPaperForm.path =
              'Property/Academic/Literature/' +
              this.professorPaperForm.journal +
              this.professorPaperForm.year +
              '/' +
              this.professorPaperForm.theme
            formData.append(
              'paperFormJsonStr',
              JSON.stringify(this.professorPaperForm)
            )
            this.professorPaperForm.file = this.file
            this.loading = true
            addPaper(formData)
              .then(() => {
                this.addReviewDialog = false
                this.loading = false
                if (this.activeTab === 'paperByProfessor') {
                  this.$refs.reviewTab.fetchPaper(1)
                  this.$refs.reviewTab.currentPage = 1
                } else {
                  this.activeTab = 'paperByProfessor'
                }
                this.$notify({
                  title: '成功',
                  message: '论文记录提交成功',
                  type: 'success'
                })
              })
              .catch((err) => {
                console.log(err)
                this.loading = false
                this.$message.error('创建失败')
              })
          }
        } else {
          this.$notify({
            title: '提交失败',
            message: '请填写必要信息',
            type: 'warning'
          })
        }
      })
    },
    // 添加外部论文评审记录
    addExternalReview(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.externalPaperForm.startTime = this.externalPaperForm.period[0]
          this.externalPaperForm.endTime = this.externalPaperForm.period[1]
          const formData = new FormData()
          if (this.file) {
            formData.append('file', this.file.raw)
          }
          this.externalPaperForm.path =
            'Property/Academic/Literature/' + this.externalPaperForm.theme
          formData.append(
            'externalPaperFormJsonStr',
            JSON.stringify(this.externalPaperForm)
          )
          addExReview(formData)
            .then(() => {
              this.addReviewDialog = false
              this.loading = false

              if (this.activeTab === 'paperExternal') {
                this.$refs.reviewTab.fetchExPaper(1)
              } else {
                this.activeTab = 'paperExternal'
              }

              this.$notify({
                title: '成功',
                message: '外部评审创建成功',
                type: 'success'
              })
            })
            .catch((err) => {
              console.log(err)
              this.loading = false
              if (this.externalPaperForm.id === null) {
                this.$message.error('创建失败')
              }
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
    modifyInternalReview(form) {
      this.addReviewDialog = true
      this.addReviewContent = 'internalReview'

      this.internalPaperForm.id = form.id
      this.internalPaperForm.title = form.title
      this.internalPaperForm.journal = form.journal
      this.internalPaperForm.paperType = form.paperType
      this.internalPaperForm.issueDate = form.issueDate
      this.internalPaperForm.authors = form.authors
    },
    modifyExternalReview(item) {
      this.addReviewDialog = true
      this.addReviewContent = 'externalReview'

      this.externalPaperForm.id = item.id
      this.externalPaperForm.title = item.title
      this.externalPaperForm.period = [item.vote.startTime, item.vote.endTime]
    },
    modifyProfessorReview(form) {
      this.addReviewDialog = true
      this.addReviewContent = 'paperByProfessorReview'

      this.professorPaperForm.id = form.id
      this.professorPaperForm.title = form.title
      this.professorPaperForm.journal = form.journal
      this.professorPaperForm.paperType = form.paperType
      this.professorPaperForm.issueDate = form.issueDate
      this.professorPaperForm.authors = form.authors
    },
    // 关闭前清空表单
    closeAddReviewDialog() {
      this.addReviewContent = undefined
      // this.$refs.internalPaperForm.resetFields()
      this.internalPaperForm = {
        id: null,
        title: null,
        journal: null,
        paperType: null,
        isStudentFirstAuthor: true,
        authors: [
          {
            num: 1,
            name: '',
            uid: null
          }
        ]
      }
      this.externalPaperForm = {
        id: null,
        title: null,
        period: ''
      }
      this.professorPaperForm = {
        id: null,
        title: null,
        journal: null,
        paperType: null,
        firstAuthor: null,
        isStudentFirstAuthor: false,
        authors: [
          {
            num: 1,
            name: '',
            uid: null
          }
        ]
      }
    },
    // 添加论文作者
    addAuthor() {
      const val = this.internalPaperForm.authors.length + 1
      this.internalPaperForm.authors.push({
        num: val,
        uid: ''
      })
    },
    // 添加非学生一作作者
    addNonFirstAuthor() {
      const val = this.professorPaperForm.authors.length + 1
      this.professorPaperForm.authors.push({
        num: val,
        uid: ''
      })
    },
    // 移除论文作者
    rmAuthor() {
      if (this.internalPaperForm.authors.length !== 1) {
        this.internalPaperForm.authors.pop()
      }
    },
    // 移除非学生一作作者
    rmNonFirstAuthor() {
      if (this.professorPaperForm.authors.length !== 1) {
        this.professorPaperForm.authors.pop()
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

.paper-form {
  display: flex;
}

.dialog-content {
  width: inherit;
  display: flex;
  justify-content: center;
}

.app-container {
  background-color: #fafafa;
}

.paper-box {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
}

@media only screen and (min-width: 1400px) {
  .paper-box {
    max-width: 1305px !important;
  }
}
</style>

<style lang="scss">
/* 解决上传文件名过长导致form表单显示过长的问题 */
.paper-form {
  form.el-form {
    width: 350px;
  }
}
</style>
