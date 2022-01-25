<template>
  <div>
    <div class="personalInfoForm">
      <el-form ref="form" :model="personalInfoForm" label-width="80px">
<!--        基本信息-->
        <div class="basicInfo">
          <el-row style="margin-bottom: 15px">基本信息</el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名:">
                <el-input v-model="personalInfoForm.name" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学号:">
                <el-input v-model="personalInfoForm.stuNum" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号:">
                <el-input v-model="personalInfoForm.idCardNo" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="银行卡号:">
                <el-input v-model="personalInfoForm.creditCard" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="本科学校 :">
                <el-input v-model="personalInfoForm.undergraduateCollege" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="硕士学校:">
                <el-input v-model="personalInfoForm.masterCollege" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="当前状态:">
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
              <el-form-item label="开始时间:">
                <el-date-picker
                  v-model="personalInfoForm.rentingStart"
                  type="date"
                  placeholder="选择日期"
                  style="width: 150px">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束时间:">
                <el-date-picker
                  v-model="personalInfoForm.rentingEnd"
                  type="date"
                  placeholder="选择日期"
                  style="width: 150px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="住址:">
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
              <el-form-item label="备注:">
                <el-input v-model="personalInfoForm.remark" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

      </el-form>
    </div>
    <el-row type="flex" justify="center">
        <el-button type="primary"  size="medium" @click="confirmModify" style="margin-bottom: 10px">确认修改</el-button>
    </el-row>
  </div>
</template>

<script>
import { getUserDetail, updateUserInfo } from '@/api/user'
export default {
  name: 'PersonalInfo',
  data() {
    return {
      personalInfoForm: {}
    }
  },
  created() {
    getUserDetail().then(res => {
      console.log(res)
      this.personalInfoForm = res.data
      console.log(this.personalInfoForm)
    })
  },
  methods: {
    confirmModify() {
      console.log(this.personalInfoForm)
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
    }
  }
}
</script>

<style scoped>

</style>
