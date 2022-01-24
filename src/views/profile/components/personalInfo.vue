<template>
  <div>
    <div class="personalInfoForm">
      <el-form ref="form" :model="personalInfoForm" label-width="80px">
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
        <el-row>
          <el-col :span="16">
            <el-form-item label="备注:">
              <el-input v-model="personalInfoForm.remark" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row type="flex" justify="center">
      <el-col :span="8">
        <el-button type="primary"  size="large" @click="confirmModify" >确认修改</el-button>
      </el-col>
    </el-row>
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
  },
  methods: {
    confirmModify() {
      console.log(this.personalInfoForm)
    }
  }
}
</script>

<style scoped>

</style>
