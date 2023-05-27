<template>
  <div class="prize-container">
    <div class="buttons">
      <el-button
        type="primary"
        style="margin-bottom: 8px"
        icon="el-icon-document"
        @click="download"
      >
        导出荣誉资产
      </el-button>
    </div>
    <div class="prizeList">
      <!-- 用户名单 -->
      <el-card
        shadow="never"
        class="box-prize-card"
        style="width: 35%; padding: 0"
      >
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
      <!-- 奖项列表 -->
      <div v-loading="loading" class="box-prize-card" style="width: 65%;">
        <!-- 标题 -->
        <div class="title">
          <span style="padding-right:20px">{{ name }} 的奖项</span>
          <el-button
            v-show="addShow"
            type="primary"
            style="margin-left: 50px"
            @click="addPrizeDialogueVisible = true"
          >
            新建奖项
          </el-button>
        </div>
        <el-scrollbar
          v-if="prizeList.length != 0"
          style="height: 93%;"
          wrap-style="overflow-x: hidden;"
        >
          <el-table :data="prizeList" style="width: 90%; margin-left: 20px;">
            <el-table-column prop="prizeTime" label="获奖时间" width="100" />
            <el-table-column prop="prizeName" label="奖项名称" width="200" />
            <el-table-column prop="level" label="级别" width="100">
              <template slot-scope="scope">
                {{ levelConvertor[scope.row.level] }}
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="200" />
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  v-show="addShow"
                  type="primary"
                  @click="modifyPrizeClick(scope.row)"
                >修改</el-button>
                <el-button
                  v-show="addShow"
                  type="danger"
                  @click="deletePrizeClick(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
        <div v-else class="null">
          <svg-icon icon-class="null" style="font-size:32px" />
          <div style="font-size:13px;height:20px;color:rgba(0, 0, 0, 0.45);">
            无荣誉资产，请继续努力！
          </div>
        </div>
      </div>
    </div>
    <!--      新增奖项-->
    <el-dialog
      title="新增奖项"
      :visible.sync="addPrizeDialogueVisible"
      width="400px"
    >
      <el-form
        ref="addPrizeForm"
        :model="addPrizeForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item prop="prizeName" label="获奖名称:">
          <el-col :span="12">
            <el-input v-model="addPrizeForm.prizeName" size="mini" />
          </el-col>
        </el-form-item>
        <el-form-item prop="prizeTime" label="获奖时间:">
          <el-col :span="12">
            <el-date-picker
              v-model="addPrizeForm.prizeTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width: 150px"
            />
          </el-col>
        </el-form-item>
        <el-form-item prop="level" label="级别:">
          <el-col :span="12">
            <el-select v-model="addPrizeForm.level" placeholder="请选择">
              <el-option label="校级" :value="0" />
              <el-option label="省级" :value="1" />
              <el-option label="国家级" :value="2" />
              <el-option label="国际级" :value="3" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="备注:">
          <el-col :span="12">
            <el-input v-model="addPrizeForm.remark" />
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addPrizeDialogueVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addPrize('addPrizeForm')"
        >添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改奖项信息"
      :visible.sync="modifyPrizeDialogueVisible"
      width="400px"
    >
      <el-form
        ref="modifyPrizeForm"
        :model="modifyPrizeForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item prop="prizeName" label="获奖名称:">
          <el-col :span="12">
            <el-input v-model="modifyPrizeForm.prizeName" size="mini" />
          </el-col>
        </el-form-item>
        <el-form-item prop="prizeTime" label="获奖时间:">
          <el-col :span="12">
            <el-date-picker
              v-model="modifyPrizeForm.prizeTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width: 150px"
            />
          </el-col>
        </el-form-item>
        <el-form-item prop="level" label="级别:">
          <el-col :span="12">
            <el-select v-model="modifyPrizeForm.level" placeholder="请选择">
              <el-option label="校级" :value="0" />
              <el-option label="省级" :value="1" />
              <el-option label="国家级" :value="2" />
              <el-option label="国际级" :value="3" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="备注:">
          <el-col :span="12">
            <el-input
              v-model="modifyPrizeForm.remark"
            /></el-col>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="modifyPrizeDialogueVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmModifyPrize('modifyPrizeForm')"
        >确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserPrizes, addPrize, deletePrize, updatePrize } from '@/api/user'
import { getUserList } from '@/api/common'
import { downloadUserPrizeData } from '@/api/excel'
import fileDownload from 'js-file-download'

export default {
  name: 'Prize',
  data() {
    return {
      addPrizeDialogueVisible: false,
      modifyPrizeDialogueVisible: false,
      userList: [],
      prizeList: [],
      name: '',
      loading: false,
      currentId: 0,
      levelConvertor: ['校级', '省级', '国家级', '国际级'],
      addPrizeForm: {},
      modifyPrizeForm: {},
      rules: {
        prizeName: [
          { required: true, message: '请输入奖项名称', trigger: 'blur' }
        ],
        prizeTime: [
          { required: true, message: '请输入获奖时间', trigger: 'blur' }
        ],
        level: [{ required: true, message: '请输入奖项等级', trigger: 'blur' }]
      }
    }
  },
  computed: {
    addShow() {
      return (
        sessionStorage.getItem('role') === 'admin' ||
        sessionStorage.getItem('role') === 'editor' ||
        sessionStorage.getItem('uid') === this.currentId.toString()
      )
    }
  },
  created() {
    getUserList().then((res) => {
      this.userList = res.data
      this.setCurrent(this.userList[0])
      this.name = this.userList[0].name
      this.currentId = this.userList[0].id
      getUserPrizes(this.currentId).then((res) => {
        this.prizeList = res.data
      })
    })
  },
  methods: {
    addPrize(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addPrize(this.currentId, this.addPrizeForm).then((res) => {
            this.addPrizeForm = {}
            if (res) {
              this.$message({
                showClose: true,
                message: '奖项信息添加成功！',
                type: 'success'
              })
            }
            getUserPrizes(this.currentId).then((res) => {
              this.prizeList = res.data
            })
            this.addPrizeDialogueVisible = false
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
    modifyPrizeClick(data) {
      console.log(data)
      this.modifyPrizeDialogueVisible = true
      this.modifyPrizeForm = JSON.parse(JSON.stringify(data))
    },
    async confirmModifyPrize(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          var res = await updatePrize(
            sessionStorage.getItem('uid'),
            this.modifyPrizeForm.id,
            this.modifyPrizeForm
          )
          if (res) {
            this.$message({
              showClose: true,
              message: '奖项信息修改成功！',
              type: 'success'
            })
          }
          this.modifyPrizeDialogueVisible = false
          getUserPrizes(this.currentId).then((res) => {
            this.prizeList = res.data
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
    async deletePrizeClick(data) {
      await deletePrize(sessionStorage.getItem('uid'), data.id)
      this.$message({
        showClose: true,
        message: '奖项信息删除成功！',
        type: 'success'
      })
      getUserPrizes(this.currentId).then((res) => {
        this.prizeList = res.data
      })
    },
    download() {
      downloadUserPrizeData()
        .then((res) => {
          fileDownload(res.data, '荣誉表.xlsx')
        })
        .catch((err) => {
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
      getUserPrizes(val.id).then((res) => {
        this.prizeList = res.data
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.prize-container {
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
.prizeList {
  max-width: 1305px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: space-between;
}
.box-prize-card {
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
