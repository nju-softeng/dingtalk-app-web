<template>
  <div class="fixed-container">
    <div class="buttons">
      <el-button
        type="primary"
        style="margin-bottom: 8px"
        icon="el-icon-document"
        @click="download"
      >
        导出固定资产
      </el-button>
    </div>
    <div class="fixedList">
      <!-- 用户名单 -->
      <el-card shadow="never" class="box-fixed-card" style="width: 35%; padding: 0">
        <el-table
          ref="table"
          class="table"
          height="80vh"
          :data="userList"
          highlight-current-row
          style="width: 100%"
          :header-cell-style="{ background: '#eef1f6' }"
          @current-change="handleCurrentChange"
        >
          <el-table-column type="index" />
          <el-table-column prop="name" label="姓名" />
        </el-table>
      </el-card>
      <!-- 固定资产列表 -->
      <div v-loading="loading" class="box-fixed-card" style="width: 65%;">
        <div class="title">
          <span style="padding-right:20px">{{ name }} 的奖项</span>
          <el-button v-show="addShow" type="primary" style="margin-left: 50px" @click="addPropertyDialogueVisible=true">
            新增固定资产
          </el-button>
        </div>
        <el-scrollbar v-if="fixedList.length != 0" style="height: 93%;" wrap-style="overflow-x: hidden;">
          <el-table
            :data="fixedList"
            style="width: 90%; margin-left: 20px;"
          >
            <el-table-column
              prop="name"
              label="名称"
              width="200"
            />
            <el-table-column
              prop="startTime"
              label="开始时间"
              width="200"
            />
            <el-table-column
              prop="type"
              label="类型"
              width="100"
            />
            <el-table-column
              label="操作"
              width="200"
            >
              <template slot-scope="scope">
                <el-button v-show="addShow" type="primary" @click="modifyPropertyClick(scope.row)">修改</el-button>
                <el-button v-show="addShow" type="danger" @click="deletePropertyClick(scope.row)">删除</el-button>
              </template>

            </el-table-column>
          </el-table>
        </el-scrollbar>
        <div v-else class="null">
          <svg-icon icon-class="null" style="font-size:32px" />
          <div style="font-size:13px;height:20px;color:rgba(0, 0, 0, 0.45);">
            无固定资产，请为实验室做一份贡献！
          </div>
        </div>
      </div>
      <!--      新增固定资产-->
      <el-dialog
        title="新增固定资产"
        :visible.sync="addPropertyDialogueVisible"
        width="30%"
      >
        <el-form ref="addPropertyForm" :rules="rules" :model="addPropertyForm" label-width="100px">
          <el-form-item prop="name" label="名称:">
            <el-col :span="16">
              <el-input v-model="addPropertyForm.name" />
            </el-col>
          </el-form-item>
          <el-form-item prop="startTime" label="开始时间:">
            <el-col :span="15">
              <el-date-picker
                v-model="addPropertyForm.startTime"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width: 150px"
              />
            </el-col>
          </el-form-item>
          <el-form-item prop="type" label="类型：">
            <el-col :span="16">
              <el-select v-model="addPropertyForm.type">
                <el-option
                  v-for="item in types"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item prop="remark" label="备注:">
            <el-col :span="16">
              <el-input v-model="addPropertyForm.remark" type="textarea" />
            </el-col>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addPropertyDialogueVisible = false">取 消</el-button>
          <el-button type="primary" @click="addProperty('addPropertyForm')">添加</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="修改固定资产信息"
        :visible.sync="modifyPropertyDialogueVisible"
        width="30%"
      >
        <el-form ref="modifyPropertyForm" :rules="rules" :model="modifyPropertyForm" label-width="100px">
          <el-form-item prop="name" label="名称:">
            <el-col :span="16">
              <el-input v-model="modifyPropertyForm.name" size="mini" />
            </el-col>
          </el-form-item>
          <el-form-item prop="startTime" label="开始时间:">
            <el-col :span="15">
              <el-date-picker
                v-model="modifyPropertyForm.startTime"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width: 150px"
              />
            </el-col>
          </el-form-item>
          <el-form-item prop="type" label="类型:">
            <el-col :span="16">
              <el-select v-model="modifyPropertyForm.type">
                <el-option
                  v-for="item in types"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item prop="remark" label="备注:">
            <el-col :span="16">
              <el-input v-model="modifyPropertyForm.remark" type="textarea" />
            </el-col>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="modifyPropertyDialogueVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmModifyProperty('modifyPropertyForm')">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div></template>

<script>
import { getUserProperties, addProperty, deleteProperty, updateProperty } from '@/api/user'
import { getUserList } from '@/api/common'
import { downloadUserPropertyData } from '@/api/excel'
import fileDownload from 'js-file-download'

export default {
  name: 'Property',
  data() {
    return {
      addPropertyDialogueVisible: false,
      modifyPropertyDialogueVisible: false,
      userList: [],
      fixedList: [],
      name: '',
      loading: false,
      currentId: 0,
      typeConvertor: ['校级', '省级', '国家级', '国际级'],
      addPropertyForm: {},
      modifyPropertyForm: {},
      rules: {
        name: [{ required: true, message: '请输入物品名称', trigger: 'blur' }],
        startTime: [{ required: true, message: '请输入开始时间', trigger: 'blur' }],
        type: [{ required: true, message: '请选择物品类型', trigger: 'blur' }]
      },
      types: [
        { value: '图书',
          label: '图书' },
        { value: '材料',
          label: '材料' },
        { value: '设备',
          label: '设备' }
      ]
    }
  },
  computed: {
    addShow() {
      return sessionStorage.getItem('role') === 'admin' || sessionStorage.getItem('role') === 'editor' || sessionStorage.getItem('uid') === this.currentId.toString()
    }
  },
  created() {
    getUserList().then(res => {
      this.userList = res.data
      this.setCurrent(this.userList[0])
      this.name = this.userList[0].name
      this.currentId = this.userList[0].id
      getUserProperties(this.currentId).then(res => {
        this.fixedList = res.data
      })
    })
  },
  methods: {
    addProperty(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addPropertyForm.preserver = this.currentId
          addProperty(this.currentId, this.addPropertyForm).then(res => {
            this.addPropertyForm = {}
            if (res) {
              this.$message({
                showClose: true,
                message: '固定资产信息添加成功！',
                type: 'success'
              })
            }
            getUserProperties(this.currentId).then(res => {
              this.fixedList = res.data
            })
            this.addPropertyDialogueVisible = false
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
    modifyPropertyClick(data) {
      this.modifyPropertyDialogueVisible = true
      this.modifyPropertyForm = JSON.parse(JSON.stringify(data))
    },
    async confirmModifyProperty(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.modifyPropertyForm.preserver = this.currentId
          var res = await updateProperty(this.modifyPropertyForm)
          if (res) {
            this.$message({
              showClose: true,
              message: '固定资产信息修改成功！',
              type: 'success'
            })
          }
          this.modifyPropertyDialogueVisible = false
          getUserProperties(this.currentId).then(res => {
            this.fixedList = res.data
          })
        } else {
          this.$notify({
            title: '修改失败',
            message: '请填写必要信息',
            type: 'warning'
          })
        }
      })
    },
    async deletePropertyClick(data) {
      await deleteProperty(data.id)
      this.$message({
        showClose: true,
        message: '固定资产信息删除成功！',
        type: 'success'
      })
      getUserProperties(this.currentId).then(res => {
        this.fixedList = res.data
      })
    },
    download() {
      downloadUserPropertyData().then(res => {
        fileDownload(res.data, '固定资产表.xlsx')
      }).catch(err => {
        console.log(err)
        this.$message.error('下载失败')
      })
    },
    setCurrent(row) {
      this.$refs.table.setCurrentRow(row)
    },
    handleCurrentChange(val) {
      this.loading = true
      this.name = val.name
      this.currentId = val.id
      getUserProperties(val.id).then(res => {
        this.fixedList = res.data
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
  .fixed-container {
    padding: 12px;
    /*background-color: #fafafa;*/
    border-radius: 0;
  }
  .buttons {
    max-width: 1305px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: space-between;
  }
  .title {
    min-height: 36px;
    padding: 5px 40px;
    margin-bottom: 5px;
  }
  .fixedList {
    max-width: 1305px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: space-between;
  }
  .box-fixed-card {
    border-radius: 4px;
    border: 1px solid #ebeef5;
    height: 85vh;
    padding: 10px 0;
    background-color: white;
  }
  .null {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    flex-direction: column;
  }
</style>

