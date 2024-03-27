<template>
  <div>
    <div class="personalInfoForm">
      <el-form
        ref="personalInfoForm"
        :rules="rules"
        :model="personalInfoForm"
        label-width="80px"
      >
        <!--        基本信息-->
        <div class="basicInfo">
          <div style="margin-bottom: 15px">基本信息</div>
          <el-form-item prop="name" label="姓名">
            <el-input v-model="personalInfoForm.name" />
          </el-form-item>
          <el-form-item prop="stuNum" label="学号">
            <el-input v-model="personalInfoForm.stuNum" />
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="personalInfoForm.idCardNo" />
          </el-form-item>
          <el-form-item label="电话号码">
            <el-input v-model="personalInfoForm.tel" />
          </el-form-item>
          <el-form-item label="银行卡号">
            <el-input v-model="personalInfoForm.creditCard" />
          </el-form-item>
          <el-form-item label="开户银行">
            <el-input
              v-model="personalInfoForm.bankName"
              placeholder="例：工商银行汉口路支行"
            />
          </el-form-item>
          <el-form-item prop="undergraduateCollege" label="本科学校 ">
            <el-input v-model="personalInfoForm.undergraduateCollege" />
          </el-form-item>
          <el-form-item prop="masterCollege" label="硕士学校">
            <el-input v-model="personalInfoForm.masterCollege" />
          </el-form-item>
          <el-form-item label="当前状态">
            <el-select
              v-model="personalInfoForm.workState"
              disabled
              placeholder="请选择"
            >
              <el-option label="实习" :value="true" />
              <el-option label="在校" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="管理权限">
            <el-tag
              v-if="permissionList.length === 0"
              type="info"
              effect="plain"
              class="permission-tag"
            >无管理员权限</el-tag>
            <el-tag
              v-for="permission in permissionList"
              :key="permission.id"
              effect="plain"
              class="permission-tag"
            >{{ permission.name }}</el-tag>
          </el-form-item>
          <el-form-item label="研究组">
            <TeamEdit ref="teamEdit" selection-width="100%" />
          </el-form-item>
        </div>
        <!--        住房信息-->
        <div class="rentingInfo">
          <el-row style="margin-bottom: 15px">住房信息</el-row>
          <el-row>
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="personalInfoForm.rentingStart"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="personalInfoForm.rentingEnd"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="住址">
                <el-input v-model="personalInfoForm.address" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="住房合同">
                <span v-if="personalInfoForm.leaseContractFileName != null">{{
                  personalInfoForm.leaseContractFileName
                }}</span>
                <span v-else>请上传住房合同！</span><br>
                <span style="display: flex">
                  <el-upload
                    class="uploadFIle"
                    :on-change="handleFileChange"
                    :show-file-list="false"
                    action=""
                    :auto-upload="false"
                    accept=".pdf,.jpg,.png"
                  >
                    <el-button
                      icon="el-icon-upload2"
                      type="success"
                      style="margin-right: 30px"
                      round
                    >上 传</el-button>
                  </el-upload>
                  <el-button
                    icon="el-icon-download"
                    type="primary"
                    style="margin-top: 1px"
                    round
                    @click="downloadFile"
                  >下 载</el-button>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!--        备注信息-->
        <div class="remarkInfo">
          <el-row style="margin-bottom: 15px">备注信息</el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="personalInfoForm.remark" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <el-row type="flex" justify="center">
      <el-button
        type="primary"
        size="medium"
        style="margin-bottom: 10px"
        @click="confirmModify('personalInfoForm')"
      >确认修改</el-button>
    </el-row>
  </div>
</template>

<script>
import {
  getUserDetail,
  updateUserInfo,
  updateContract,
  downloadContract
} from '@/api/user'
import { getPersonalPermissions } from '@/api/permission.js'
import TeamEdit from '@/components/TeamsEdit'
export default {
  name: 'PersonalInfo',
  components: { TeamEdit },
  data() {
    return {
      personalInfoForm: {
        name: null,
        stuNum: null,
        idCardNo: null,
        creditCard: null,
        bankName: null,
        undergraduateCollege: null,
        masterCollege: null,
        workState: null,
        rentingStart: null,
        rentingEnd: null,
        address: null,
        leaseContractFileName: null,
        leaseContractFilePath: null,
        remark: null
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        stuNum: [{ required: true, message: '请输入学号', trigger: 'blur' }],
        undergraduateCollege: [
          { required: true, message: '请输入本科学校', trigger: 'blur' }
        ],
        masterCollege: [
          { required: true, message: '请输入硕士学校', trigger: 'blur' }
        ]
      },
      permissionList: []
    }
  },
  // computed: {
  //   ...mapGetters(["uid", "device"]),
  // },
  created() {
    getUserDetail().then((res) => {
      // console.log(res)
      this.personalInfoForm = res.data
      // console.log(this.personalInfoForm)
    })
    getPersonalPermissions().then((res) => {
      this.permissionList = res.data.data
    })
  },
  methods: {
    confirmModify(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.personalInfoForm.name === '') {
            this.$message({
              showClose: true,
              message: '请填写必要信息',
              type: 'warning'
            })
            return
          }
          updateUserInfo(this.personalInfoForm)
            .then(() => {
              this.$message({
                showClose: true,
                message: '更新成功',
                type: 'success'
              })
            })
            .then(() => {
              this.$refs.teamEdit.submitTeamChange()
            })
            .finally(() => {
              getUserDetail().then((res) => {
                this.personalInfoForm = res.data
              })
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
    handleFileChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      const formData = new FormData()
      formData.append('file', file.raw)
      updateContract(formData)
        .then(() => {
          this.$notify({
            title: '成功',
            message: '论文文件上传成功',
            type: 'success'
          })
        })
        .catch(() => {
          this.$message.error('上传失败')
        })
        .finally(() => {
          getUserDetail().then((res) => {
            this.personalInfoForm.leaseContractFileName =
              res.data.leaseContractFileName
          })
        })
    },
    downloadFile() {
      downloadContract().then((res) => {
        let type
        if (
          this.personalInfoForm.leaseContractFileName
            .split('.')
            .slice(-1)[0] === '.pdf'
        ) {
          type = 'application/pdf'
        } else if (
          this.personalInfoForm.leaseContractFileName
            .split('.')
            .slice(-1)[0] === '.jpg'
        ) {
          type = 'image/jpeg'
        } else if (
          this.personalInfoForm.leaseContractFileName
            .split('.')
            .slice(-1)[0] === '.png'
        ) {
          type = 'image/png'
        }
        const binaryData = [res.data]
        const url = window.URL.createObjectURL(
          new Blob(binaryData, { type: type })
        )
        const a = document.createElement('a')
        a.download = this.personalInfoForm.leaseContractFileName
        a.href = url
        a.click()
      })
    }
  }
}
</script>

<style scoped>
.permission-tag {
  margin: 5px;
}
</style>
