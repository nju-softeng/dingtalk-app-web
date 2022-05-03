<template>
  <div class="app-container">
    <div class="projectWrap">
      <div class="projectBox">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 10px;"
          @click="currentOperation='创建项目'; addProjectDialogVisible=true"
        >新建项目
        </el-button>
        <div class="projectList">
          <el-table
            :data="projectList"
            :row-key="record => record.id + (record.version?record.version.length:0) * 10000"
            fit
            highlight-current-row
            lazy
            :load="loadVersions"
            max-height="500"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            class="tableClass"
          >
            <el-table-column label="项目名称" width="300px" align="left">
              <template slot-scope="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="版本号" width="150px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.version }}</span>
              </template>
            </el-table-column>
            <el-table-column label="代码文件" width="300px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.codeFileName }}</span>
                <div v-show="row.version" style="width: fit-content; display: inline-block">
                  <div v-if="row.codeFileName" style="width: fit-content">
                    <el-tooltip
                      effect="dark"
                      content="下载"
                      placement="top"
                    >
                      <el-button
                        class="fileBtn"
                        icon="el-icon-download"
                        size="mini"
                        circle
                        @click="downloadFile(row, 'codeFile')"
                      />
                    </el-tooltip>
                    <el-tooltip
                      effect="dark"
                      content="删除"
                      placement="top"
                    >
                      <el-button
                        class="fileBtn fileDeleteBtn"
                        icon="el-icon-close"
                        size="mini"
                        circle
                        @click="deleteFile(row, 'codeFile')"
                      />
                    </el-tooltip>
                  </div>
                  <div v-else>
                    <el-tooltip
                      effect="dark"
                      content="上传"
                      placement="top"
                    >
                      <el-upload
                        action=""
                        :http-request="uploadFile"
                        :data="row"
                        accept=".zip,.rar"
                      >
                        <el-button
                          class="fileBtn"
                          icon="el-icon-upload2"
                          size="mini"
                          circle
                        />
                      </el-upload>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="报告文件" width="300px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.reportFileName }}</span>
                <div v-show="row.version" style="width: fit-content; display: inline-block">
                  <div v-if="row.reportFileName" style="width: fit-content">
                    <el-tooltip
                      effect="dark"
                      content="下载"
                      placement="top"
                    >
                      <el-button
                        class="fileBtn"
                        icon="el-icon-download"
                        size="mini"
                        circle
                        @click="downloadFile(row, 'reportFile')"
                      />
                    </el-tooltip>
                    <el-tooltip
                      effect="dark"
                      content="删除"
                      placement="top"
                    >
                      <el-button
                        class="fileBtn fileDeleteBtn"
                        icon="el-icon-close"
                        size="mini"
                        circle
                        @click="deleteFile(row, 'reportFile')"
                      />
                    </el-tooltip>
                  </div>
                  <div v-else>
                    <el-tooltip
                      effect="dark"
                      content="上传"
                      placement="top"
                    >
                      <el-upload
                        action=""
                        :http-request="uploadFile"
                        :data="row"
                        accept=".doc,.docx,.pdf,.md"
                      >
                        <el-button
                          class="fileBtn"
                          icon="el-icon-upload2"
                          size="mini"
                          circle
                        />
                      </el-upload>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="150px" fixed="right" align="center">
              <div v-if="row.name" slot-scope="{ row }">
                <el-tooltip
                  effect="dark"
                  content="新建版本"
                  placement="top"
                >
                  <el-button
                    class="modifyBtn"
                    icon="el-icon-plus"
                    size="mini"
                    @click="addVersionDialogVisible=true; tempProjectId=row.id"
                  />
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="编辑"
                  placement="top"
                >
                  <el-button
                    class="modifyBtn"
                    type="primary"
                    icon="el-icon-s-operation"
                    size="mini"
                    @click="modifyProject(row)"
                  />
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <el-button
                    class="deleteBtn"
                    type="danger"
                    icon="el-icon-delete-solid"
                    size="mini"
                    @click="deleteWholeProject(row.id)"
                  />
                </el-tooltip>
              </div>
              <div v-else slot-scope="{ row }">
                <el-tooltip
                  effect="dark"
                  content="编辑"
                  placement="top"
                >
                  <el-button
                    class="modifyBtn"
                    type="primary"
                    icon="el-icon-s-operation"
                    size="mini"
                    style="position: relative; left: 21px"
                    @click="modifyVersion(row)"
                  />
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <el-button
                    class="deleteBtn"
                    type="danger"
                    icon="el-icon-delete-solid"
                    size="mini"
                    style="position: relative; left: 21px"
                    @click="deleteWholeVersion(row.id)"
                  />
                </el-tooltip>
              </div>
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
      :visible.sync="addProjectDialogVisible"
      width="30%"
      :before-close="clearBeforeClose"
    >
      <el-form
        ref="addProjectForm"
        :model="addProjectForm"
        :rules="rules"
        label-width="100px"
        style="margin-left: 36px"
      >
        <el-form-item prop="name" label="项目名称:">
          <el-col :span="12">
            <el-input v-model="addProjectForm.name" placeholder="请输入项目名称" style="width: 200px" />
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancelAddProject">取 消</el-button>
        <el-button type="primary" @click="addNewProject('addProjectForm')">确 认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="currentVersionOperation"
      :visible.sync="addVersionDialogVisible"
      width="30%"
      :before-close="clearBeforeVersionClose"
    >
      <el-form
        ref="addVersionForm"
        :model="addVersionForm"
        :rules="rules"
        label-width="100px"
        style="margin-left: 36px"
      >
        <el-form-item prop="version" label="版本名:">
          <el-col :span="12">
            <el-input v-model="addVersionForm.version" placeholder="请输入版本名" style="width: 200px" />
          </el-col>
        </el-form-item>
        <project-code-upload v-if="currentVersionOperation === '添加版本'" ref="codeChild" :file="codeFile" @changeCodeFile="changeCodeFile" />
        <project-report-upload v-if="currentVersionOperation === '添加版本'" ref="reportChild" :file="reportFile" @changeReportFile="changeReportFile" />
      </el-form>
      <span slot="footer">
        <el-button @click="cancelAddVersion">取 消</el-button>
        <el-button type="primary" @click="addNewVersion('addVersionForm')">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ProjectCodeUpload from './components/projectCodeUpload'
import ProjectReportUpload from './components/projectReportUpload'
import {
  addProjectProperty,
  deleteProjectProperty,
  getProjectPropertyList,
  getProjectPropertyDetail,
  addProjectPropertyVersion,
  updateProjectPropertyVersion,
  deleteProjectPropertyVersion,
  addProjectPropertyFile,
  deleteProjectPropertyFile,
  downloadProjectPropertyFile
} from '@/api/projectProperty'

export default {
  name: 'ProjectProperty',
  components: { ProjectCodeUpload, ProjectReportUpload },
  data() {
    return {
      total: 0,
      currentPage: 1,
      projectList: [],
      tempProjectId: -1,
      addProjectDialogVisible: false,
      addVersionDialogVisible: false,
      currentOperation: '创建项目',
      currentVersionOperation: '添加版本',
      codeFile: null,
      reportFile: null,
      addProjectForm: {
        id: null,
        name: '',
        path: ''
      },
      addVersionForm: {
        id: null,
        version: '',
        codeFile: null,
        reportFile: null
      },
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        version: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        codeFile: [
          {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              if (!this.codeFile) callback(new Error('请上传项目代码文件'))
            }
          }
        ],
        reportFile: [
          {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              if (!this.reportFile) callback(new Error('请上传项目报告文件'))
            }
          }
        ]
      },
      uid: -1
    }
  },
  created() {
    this.currentPage = parseInt(sessionStorage.getItem('inner-cur-page')) || 1
    this.fetchProject(this.currentPage)
    this.uid = parseInt(sessionStorage.getItem('uid'))
  },
  methods: {
    // 分页获取项目
    fetchProject(page) {
      // console.log(this.projectList)
      return new Promise((resolve, reject) => {
        getProjectPropertyList(page, 10)
          .then(res => {
            this.projectList = res.data.list
            this.total = res.data.total
            for (const i in this.projectList) {
              this.projectList[i].hasChildren = this.projectList[i].projectPropertyFileList.length
            }
            // console.log(this.projectList)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 上一页
    handlePrev(val) {
      this.fetchProject(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 下一页
    handleNext(val) {
      this.fetchProject(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 分页获取数据
    handleCurrentChange(val) {
      this.fetchProject(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    deleteWholeProject(id) {
      deleteProjectProperty(id).then(() => {
        this.$message.success('删除成功')
        this.fetchProject(this.currentPage)
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },
    deleteWholeVersion(id) {
      deleteProjectPropertyVersion(id).then(() => {
        this.$message.success('删除成功')
        this.projectList = []
        this.fetchProject(this.currentPage)
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },
    addNewProject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addProjectForm.path = 'Property/Project/SLRSystem/' + this.addProjectForm.name
          addProjectProperty(this.addProjectForm).then(() => {
            if (this.currentOperation === '创建项目') {
              this.$message.success('创建成功')
            } else if (this.currentOperation === '修改项目名称') {
              this.$message.success('修改成功')
            } else {
              this.$message.error('未知的状态！')
            }
            this.cancelAddProject()
            this.fetchProject(this.currentPage)
          }).catch(() => {
            if (this.currentOperation === '创建项目') {
              this.$message.error('添加失败')
            } else if (this.currentOperation === '修改项目名称') {
              this.$message.error('修改失败')
            } else {
              this.$message.error('未知的状态！')
            }
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
    addNewVersion(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.currentVersionOperation === '添加版本') {
            const formData = new FormData()
            formData.append('name', this.addVersionForm.version)
            formData.append('codeFile', this.codeFile.raw)
            formData.append('reportFile', this.reportFile.raw)
            addProjectPropertyVersion(this.tempProjectId, formData).then(() => {
              this.$message.success('添加成功')
              this.cancelAddVersion()
              this.projectList = []
              this.fetchProject(this.currentPage)
            }).catch(() => {
              this.$message.error('添加失败')
            })
          } else if (this.currentVersionOperation === '修改版本名') {
            updateProjectPropertyVersion(this.addVersionForm.id, this.addVersionForm).then(() => {
              this.$message.success('修改成功')
              this.cancelAddVersion()
              this.projectList = []
              this.fetchProject(this.currentPage)
            }).catch(() => {
              this.$message.error('修改失败')
            })
          } else {
            this.$message.error('未知的状态！')
          }
        } else {
          this.$notify({
            title: '添加失败',
            message: '请填写必要信息',
            type: 'warning'
          })
        }
      })
    },
    modifyProject(row) {
      this.currentOperation = '修改项目名称'
      this.addProjectForm.id = row.id
      this.addProjectForm.version = row.name
      this.addProjectDialogVisible = true
    },
    modifyVersion(row) {
      this.currentVersionOperation = '修改版本名'
      this.addVersionForm.id = row.id
      this.addVersionForm.version = row.version
      this.addVersionDialogVisible = true
    },
    clearBeforeClose(done) {
      this.addProjectForm = {
        id: null,
        name: '',
        path: ''
      }
      return done(true)
    },
    clearBeforeVersionClose(done) {
      this.addVersionForm = {
        id: null,
        version: '',
        codeFile: null,
        reportFile: null
      }
      this.tempProjectId = -1
      if (this.currentVersionOperation === '添加版本') {
        this.$refs.codeChild.handleClose()
        this.$refs.reportChild.handleClose()
      }
      return done(true)
    },
    cancelAddProject() {
      this.addProjectDialogVisible = false
      this.addProjectForm = {
        id: null,
        name: '',
        path: ''
      }
    },
    cancelAddVersion() {
      this.addVersionDialogVisible = false
      this.addVersionForm = {
        id: null,
        version: '',
        codeFile: null,
        reportFile: null
      }
      this.tempProjectId = -1
      if (this.currentVersionOperation === '添加版本') {
        this.$refs.codeChild.handleClose()
        this.$refs.reportChild.handleClose()
      }
    },
    changeCodeFile(file) {
      this.codeFile = file
    },
    changeReportFile(file) {
      this.reportFile = file
    },
    loadVersions(tree, treeNode, resolve) {
      getProjectPropertyDetail(tree.id).then(res => {
        // console.log(res.data.projectPropertyFileList)
        resolve(res.data.projectPropertyFileList)
      })
    },
    getType(file, fileType) {
      const fileName = fileType === 'codeFile' ? file.codeFileName : file.reportFileName
      let type
      if (fileName.split('.').slice(-1)[0] === '.zip') {
        type = 'application/zip'
      } else if (fileName.split('.').slice(-1)[0] === '.rar') {
        type = 'application/x-rar-compressed'
      } else if (fileName.split('.').slice(-1)[0] === '.doc') {
        type = 'application/msword'
      } else if (fileName.split('.').slice(-1)[0] === '.docx') {
        type = 'application/vnd.openxmlformats-officedoucment.wordprocessingml.document'
      } else if (fileName.split('.').slice(-1)[0] === '.md') {
        type = 'text/x-markdown'
      } else if (fileName.split('.').slice(-1)[0] === '.pdf') {
        type = 'application/pdf'
      }
      return type
    },
    downloadFile(row, type) {
      // console.log(row)
      downloadProjectPropertyFile(row.id, type).then(res => {
        const binaryData = [res.data]
        const url = window.URL.createObjectURL(new Blob(binaryData, { type: this.getType(row, type) }))
        const a = document.createElement('a')
        a.download = type === 'codeFile' ? row.codeFileName : row.reportFileName
        a.href = url
        a.click()
      })
    },
    deleteFile(row, type) {
      deleteProjectPropertyFile(row.id, type).then(res => {
        if (res) {
          this.$message.success('删除成功！')
          if (type === 'codeFile') {
            row.codeFileId = null
            row.codeFileName = null
          } else {
            row.reprotFileId = null
            row.reportFileName = null
          }
        }
      }).catch(err => {
        this.$message.error('删除失败！')
        console.log(err)
      })
    },
    uploadFile(data) {
      let fileType
      if (data.file.name.split('.').slice(-1)[0] === 'zip' || data.file.name.split('.').slice(-1)[0] === 'rar') {
        fileType = 'codeFile'
      } else {
        fileType = 'reportFile'
      }
      const fd = new FormData()
      fd.append('file', data.file)
      addProjectPropertyFile(data.data.id, fileType, fd).then(res => {
        if (res) {
          this.$notify.success('上传成功!')
          if (fileType === 'codeFile') {
            data.data.codeFileId = res.data
            data.data.codeFileName = data.file.name
          } else {
            data.data.reportFileId = res.data
            data.data.reportFileName = data.file.name
          }
        }
      }).catch(err => {
        this.$notify.error('上传失败！')
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
  .app-container {
    padding: 0 12px;
    background-color: #fafafa;
    border-radius: 0;
    display: flex;
    align-content: center;
    margin-top: 20px;
  }

  .projectWrap {
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .projectBox {
    background: #fff;
    padding: 10px 15px;
    min-height: 540px;
    width: 90vw;
  }

  @media only screen and (min-width: 1400px) {
    .projectBox {
      max-width: 1305px !important;
    }
  }

  .projectList {
    min-height: 500px;
  }

  .pagination {
    margin-top: 16px;
    display: flex;
    justify-content: center;
  }

  .modifyBtn {
    padding: 2px 6px;
    border-radius: 5px;
    margin-left: 16px;
  }

  .fileBtn {
    padding: 3px;
    font-size: 8px;
    margin-left: 10px;
    line-height: 10px;
  }

  .fileDeleteBtn:hover{
    background-color: #ffd7d7;
    border-color: #ffa0a0;
    color: red;
  }

  .deleteBtn {
    padding: 2px 6px;
    border-radius: 5px;
    margin-left: 16px;
  }
</style>
