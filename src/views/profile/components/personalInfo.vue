<template>
  <div>
    <div class="personalInfoForm">
      <el-form ref="form" :model="personalInfoForm" label-width="80px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="姓名" label-width="55px">
              <el-input v-model="personalInfoForm.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="学号" label-width="55px">
              <el-input v-model="personalInfoForm.stuNum" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="身份证号" >
              <el-input v-model="personalInfoForm.identityCardId" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="银行卡号" >
              <el-input v-model="personalInfoForm.bankCardId"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="本科学校" >
              <el-input v-model="personalInfoForm.undergraduateSchool"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="硕士学校" >
              <el-input v-model="personalInfoForm.masterSchool"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="当前状态" >
              <el-select v-model="personalInfoForm.state" placeholder="请选择">
                <el-option value="实习">实习</el-option>
                <el-option value="在校">在校</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getUserDetail } from '@/api/user'
export default {
  name: 'PersonalInfo',
  data() {
    return {
      personalInfoForm: {}
    }
  },
  created() {
    getUserDetail().then(res => {
      this.personalInfoForm = res.data
    })
  }
}
</script>

<style scoped>

</style>
