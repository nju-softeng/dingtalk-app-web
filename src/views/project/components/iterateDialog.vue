<template>
  <div class="dialog">
    <!-- 添加迭代dialog -->
    <el-dialog :visible.sync="visible" width="60%" @open="toOpen" @close="$emit('update:show', false)" @closed="handleClosed">
      <div slot="title">{{ title }} - 第 {{ cnt + 1 }} 次迭代</div>
      <!-- 表单 -->
      <el-form ref="iterateform" v-loading="loading" style="width:100%" :rules="rules" :model="iterateform">
        <el-form-item prop="dates">
          <span slot="label">
            <svg-icon icon-class="paper" /> 起止时间: </span>
          <el-date-picker v-model="iterateform.dates" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item prop="dingIds">
          <span slot="label">
            <svg-icon icon-class="paper" /> 分配任务: </span>
          <el-tag v-for="(u, index) in userlist" :key="index" size="medium" closable style="margin: 0 2px" @close="closeTag(u)">{{ u.name }}</el-tag>
          <el-button style="margin-left:2px" size="mini" @click="choose()">
            <i>
              <svg-icon icon-class="addperson" /> </i> 添加</el-button>
        </el-form-item>
      </el-form>
      <!-- 确认按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitIterate()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { createIteration } from '@/api/project.js'
import { contactChoose } from '@/utils/dingtalk'

export default {
  props: ['show', 'pid', 'title', 'cnt', 'edit'],
  data() {
    return {
      userlist: [],
      list: [],
      visible: this.show,
      loading: false,
      iterateform: {
        id: '',
        cnt: '',
        dates: [],
        dingIds: [],
        updateDingIds: false
      },
      tmp: {
        name: '',
        dates: ['', '']
      },
      dclist: [],
      rules: {
        dates: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        dingIds: [{ required: true, message: '请分配任务', trigger: 'blur' }]
      }
    }
  },
  watch: {
    show() {
      this.visible = this.show
    }
  },
  methods: {
    // dialog 打开前渲染编辑数据
    toOpen() {
      if (this.edit != null) {
        this.$nextTick(() => {
          this.iterateform.dates.push(this.edit.beginTime)
          this.iterateform.dates.push(this.edit.endTime)
          this.userlist = this.edit.iterationDetails.map(x => {
            return x.user
          })
          this.iterateform.dingIds = this.edit.iterationDetails.map(x => {
            return x.user.userid
          })
          this.iterateform.id = this.edit.id
        })
      }
    },
    // 创建或更新项目
    submitIterate() {
      this.$refs.iterateform.validate(valid => {
        if (valid) {
          this.loading = true
          createIteration(this.pid, this.iterateform)
            .then(() => {
              this.$emit('submitted', true)
              this.visible = false
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success'
              })
            })
            .finally(() => {
              this.loading = false
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
    // 钉钉选人
    choose() {
      this.iterateform.updateDingIds = true
      contactChoose(window.location.href, this.iterateform.dingIds).then(
        res => {
          this.userlist = res
          this.iterateform.dingIds = res.map(x => x.userid)
        }
      )
    },
    // 取消选中的用户
    closeTag(u) {
      this.iterateform.updateDingIds = true
      this.userlist.splice(this.userlist.indexOf(u), 1)
      this.iterateform.dingIds.splice(
        this.iterateform.dingIds.indexOf(u.userid),
        1
      )
    },
    handleClosed() {
      this.$refs.iterateform.resetFields()
      this.userlist = []
      this.iterateform.updateDingIds = false
      this.iterateform.id = null
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog /deep/ .el-dialog__body {
  padding-top: 10px;
  padding-bottom: 0px;
}
.dialog /deep/ .el-dialog__title {
  font-size: 13px;
}
</style>
