<template>
  <div>
    <div class="personalInfoForm">
      <el-form ref="personalInfoForm" :rules="rules" :model="personalInfoForm" label-width="80px">
        <!--        基本信息-->
        <div class="basicInfo">
          <el-row style="margin-bottom: 15px">基本信息</el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="name" label="姓名">
                <el-input v-model="personalInfoForm.name" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="stuNum" label="学号">
                <el-input v-model="personalInfoForm.stuNum" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号">
                <el-input v-model="personalInfoForm.idCardNo" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="银行卡号">
                <el-input v-model="personalInfoForm.creditCard" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="undergraduateCollege" label="本科学校 ">
                <el-input v-model="personalInfoForm.undergraduateCollege" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="masterCollege" label="硕士学校">
                <el-input v-model="personalInfoForm.masterCollege" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="当前状态">
                <el-select v-model="personalInfoForm.workState" placeholder="请选择">
                  <el-option label="实习" :value="true" />
                  <el-option label="在校" :value="false" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!--        住房信息-->
        <div class="rentingInfo">
          <el-row style="margin-bottom: 15px">住房信息</el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="personalInfoForm.rentingStart"
                  type="date"
                  placeholder="选择日期"
                  style="width: 150px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="personalInfoForm.rentingEnd"
                  type="date"
                  placeholder="选择日期"
                  style="width: 150px"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="住址">
                <el-input v-model="personalInfoForm.address" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!--        备注信息-->
        <div class="remarkInfo">
          <el-row style="margin-bottom: 15px">备注信息</el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="备注">
                <el-input v-model="personalInfoForm.remark" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

      </el-form>
    </div>
    <el-row type="flex" justify="center">
      <el-button type="primary" size="medium" style="margin-bottom: 10px" @click="confirmModify('personalInfoForm')">确认修改</el-button>
    </el-row>
  </div>
</template>

<script>
import { getUserDetail, updateUserInfo } from '@/api/user'
import { mapGetters } from 'vuex'
export default {
  name: 'PersonalInfo',
  data() {
    return {
      personalInfoForm: {
        name: null,
        stuNum: null,
        idCardNo: null,
        creditCard: null,
        undergraduateCollege: null,
        masterCollege: null,
        workState: null,
        rentingStart: null,
        rentingEnd: null,
        address: null,
        remark: null
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        stuNum: [{ required: true, message: '请输入学号', trigger: 'blur' }],
        undergraduateCollege: [{ required: true, message: '请输入本科学校', trigger: 'blur' }],
        masterCollege: [{ required: true, message: '请输入硕士学校', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'uid'
    ])
  },
  created() {
    getUserDetail().then(res => {
      console.log(res)
      this.personalInfoForm = res.data
      console.log(this.personalInfoForm)
    })
  },
  methods: {
    confirmModify(formName) {
      this.$refs[formName].validate(valid => {
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
            .finally(() => {
              getUserDetail().then(res => {
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
    }
  }
}
</script>

<style scoped>

</style>
