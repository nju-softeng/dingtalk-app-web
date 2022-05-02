<template>
  <div class="app-container">
    <div class="dissertation-box">
      <div class="action">
        <!--添加按钮-->
        <div
          style="display: flex; justify-content: end; width: 100%; position: relative; bottom: 30px"
        >
          <el-button
            v-if="haveDissertation"
            type="primary"
            icon="el-icon-edit-outline"
            @click="goDetail(uid)"
          >跳转至我的论文
          </el-button>
          <el-button
            v-else
            type="primary"
            icon="el-icon-plus"
            @click="addDissertationDialog = true"
          >添加我的毕业论文
          </el-button>
        </div>
      </div>
      <div class="dissertationList">
        <!-- 论文列表 -->
        <div v-if="list.length === 0" style="height:200px;text-align:center;margin-top: 180px">
          <svg-icon icon-class="null" style="font-size:32px" />
          <div style="font-size: 11px; color: #97a8be">还没有人上传论文哦！</div>
        </div>
        <el-row v-else :gutter="10" style="min-height: 400px;">
          <el-col v-for="(item,index) in list" :key="index" :xs="24" :sm="8" :md="6" :lg="6">
            <div style="cursor:pointer" @click="goDetail(item.user.id)">
              <el-card shadow="hover" class="card" body-style="padding: 10px 20px 10px 20px">
                <div slot="header" class="name">
                  {{ item.user.name }}
                </div>
                <div class="info">
                  <div class="info-item"><i class="el-icon-finished" /> 毕业年份: {{ item.graduateYear }}年</div>
                  <div class="info-item">
                    <i class="el-icon-collection-tag" :style="{color: (item.state==0?'red':(item.state==1?'yellow':(item.state==2?'blue':'green')))}" />
                    论文状态: {{ stateConverter[item.state] }}
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            background
            :current-page.sync="currentPage"
            :hide-on-single-page="total < 8 ? true : false"
            small
            layout="prev, pager, next"
            :total="total"
            :page-size="8"
            @prev-click="handlePrev"
            @next-click="handleNext"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 添加论文 -->
    <el-dialog
      v-show="addDissertationDialog"
      :visible.sync="addDissertationDialog"
      top="20vh"
      :lock-scroll="false"
      width="30%"
      center
      @closed="closeAddDissertationDialog"
    >
      <!-- dialog 标题 -->
      <div slot="title" class="header-title">
        <span class="title-age"> 添加毕业论文 </span>
      </div>
      <div v-loading="loading">
        <div class="dialog-content">
          <div class="dissertation-form">
            <el-form
              ref="dissertationForm"
              :rules="rules"
              :model="dissertationForm"
              label-width="110px"
            >
              <el-form-item prop="graduateYear">
                <span slot="label"><i class="el-icon-date" /> 年份</span>
                <el-date-picker
                  v-model="dissertationForm.graduateYear"
                  value-format="yyyy"
                  format="yyyy 年"
                  style="width: 193px"
                  type="year"
                  placeholder="毕业年份"
                />
              </el-form-item>
              <file-upload ref="child" :file="file" @changeFile="changeFile" />
            </el-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="submit('dissertationForm')"
          >确 定</el-button>
          <el-button @click="closeAddDissertationDialog; addDissertationDialog=false">取 消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FileUpload from '@/views/paper/components/fileUpload'
import { getDissertationInfo, addDissertation, getDissertationDetail } from '@/api/dissertation'

export default {
  name: 'StudentDissertation',
  components: { FileUpload },
  data() {
    return {
      list: [],
      uid: -1,
      currentPage: 1,
      userName: '',
      total: 0,
      addDissertationDialog: false,
      loading: false,
      file: null,
      dissertationForm: {
        id: null,
        userId: -1,
        state: 0,
        file: null,
        graduateYear: null,
        filePath: '/Property/Academic/Student/'
      },
      rules: {
        graduateYear: [{ required: true, message: '请选择毕业年份', trigger: 'blur' }],
        file: [
          {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              if (!this.file) callback(new Error('请上传预答辩论文文件'))
            }
          }
        ]
      },
      stateConverter: ['预答辩', '审核中', '等待答辩', '答辩完成'],
      haveDissertation: false
    }
  },
  created() {
    this.currentPage = parseInt(sessionStorage.getItem('dissertation-cur-page')) || 1
    this.userName = sessionStorage.getItem('name')
    this.uid = sessionStorage.getItem('uid')
    this.getAllDissertation(this.currentPage)
    getDissertationDetail(this.uid).then(res => {
      if (res) {
        if (res.data.id != null) {
          this.haveDissertation = true
        } else {
          this.haveDissertation = false
        }
      }
    }).catch(err => {
      this.haveDissertation = false
      console.log(err)
    })
  },
  methods: {
    getAllDissertation(page) {
      getDissertationInfo(page, 8).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      }).catch(err => {
        console.log(err)
      })
    },
    // 分页前一页
    handlePrev(val) {
      this.getAllDissertation(val)
      sessionStorage.setItem('external-cur-page', val)
    },
    // 分页下一页
    handleNext(val) {
      this.getAllDissertation(val)
      sessionStorage.setItem('external-cur-page', val)
    },
    // 分页当前页
    handleCurrentChange(val) {
      this.getAllDissertation(val)
      sessionStorage.setItem('external-cur-page', val)
    },
    goDetail(id) {
      this.$router.push({
        path: '/property/academic/dissertation-detail/' + id
      })
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'dissertationForm') {
            const formData = new FormData()
            formData.append('file', this.file.raw)
            this.dissertationForm.userId = this.uid
            this.dissertationForm.filePath = 'Property/Academic/Student/' + this.dissertationForm.graduateYear + '/' + this.userName
            formData.append('dissertationVOJsonStr', JSON.stringify(this.dissertationForm))
            this.dissertationForm.file = this.file
            this.loading = true
            addDissertation(formData).then(() => {
              this.addDissertationDialog = false
              this.loading = false
              this.getAllDissertation(1)
              this.currentPage = 1
              this.$notify({
                title: '成功',
                message: '论文创建成功',
                type: 'success'
              })
              this.$refs.child.handleClose()
              this.goDetail(this.uid)
            }).catch((err) => {
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
    closeAddDissertationDialog() {
      this.dissertationForm = {
        id: null,
        userId: -1,
        state: 0,
        file: null,
        graduateYear: null,
        filePath: '/Property/Academic/Student/'
      }
      this.file = null
      this.$refs.child.handleClose()
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
    margin-bottom:10px;
    border-radius: 8px;
    border: 1px solid #e6ebf5;
    background-color: #FFFFFF;
    .name {
      padding: 6px 10px 6px 10px;
      font-weight: bold;
      font-size: 18px;
    }
    .info {
      .info-item {
        text-align:left;
        margin:12px 10px 12px 10px;
        font-size: 13px;
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }

  .dissertation-form {
    display: flex;
  }

  .dialog-content {
    display: flex;
    justify-content: center;
  }

  .app-container {
    padding-top: 0;
    background-color: #fafafa;
  }

  .dissertation-box {
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
  }

  .pagination {
    display:flex;
    justify-content:center;
  }
</style>
