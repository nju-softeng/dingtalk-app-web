<template>
  <div>
    <div class="prizeList">
      <el-row type="flex">
        <el-col :span="8">
          奖项详情
        </el-col>
        <el-col :span="8" style="float: right;margin-right: 30px">
          <el-button type="primary" @click="addPrizeDialogueVisible=true">新建奖项</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="prizeList"
        style="width: 100%"
      >
        <el-table-column
          prop="prizeTime"
          label="获奖时间"
          width="150"
        />
        <el-table-column
          prop="prizeName"
          label="奖项名称"
          width="200"
        />
        <el-table-column
          prop="level"
          label="级别"
          width="100"
        />
        <el-table-column
          prop="remark"
          label="备注"
          width="200"
        />
        <el-table-column
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="primary" @click="modifyPrize(scope.row)">修改</el-button>
            <el-button type="danger" @click="deletePrize(scope.row)">删除</el-button>
          </template>

        </el-table-column>
      </el-table>
    </div>
    <!--      新增奖项-->
    <el-dialog
      title="新增奖项"
      :visible.sync="addPrizeDialogueVisible"
      width="30%"
    >
      <el-form ref="form" :model="addPrizeForm" label-width="80px">
        <el-form-item label="获奖名称:">
          <el-col :span="12">
            <el-input v-model="addPrizeForm.prizeName" size="mini" />
          </el-col>
        </el-form-item>
        <el-form-item label="获奖时间:">
          <el-col :span="12">
            <el-date-picker
              v-model="addPrizeForm.prizeTime"
              type="date"
              placeholder="选择日期"
              style="width: 150px"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="级别:">
          <el-col :span="8">
            <el-select v-model="addPrizeForm.level" placeholder="请选择">
              <el-option label="校级" :value="0" />
              <el-option label="省级" :value="1" />
              <el-option label="国家级" :value="2" />
              <el-option label="国际级" :value="3" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="addPrizeForm.remark" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addPrizeDialogueVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPrize">添加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改奖项信息"
      :visible.sync="modifyPrizeDialogueVisible"
      width="30%"
    >
      <el-form ref="form" :model="modifyPrizeForm" label-width="80px">
        <el-form-item label="获奖名称:">
          <el-col :span="12">
            <el-input v-model="modifyPrizeForm.prizeName" size="mini" />
          </el-col>
        </el-form-item>
        <el-form-item label="获奖时间:">
          <el-col :span="12">
            <el-date-picker
              v-model="modifyPrizeForm.prizeTime"
              type="date"
              placeholder="选择日期"
              style="width: 150px"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="级别:">
          <el-col :span="8">
            <el-select v-model="modifyPrizeForm.level" placeholder="请选择">
              <el-option label="校级" :value="0" />
              <el-option label="省级" :value="1" />
              <el-option label="国家级" :value="2" />
              <el-option label="国际级" :value="3" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="modifyPrizeForm.remark" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="modifyPrizeDialogueVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyPrize">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserPrizes, addPrize } from '@/api/user'

export default {
  name: 'Prize',
  data() {
    return {
      addPrizeDialogueVisible: false,
      modifyPrizeDialogueVisible: false,
      prizeList: [{
        prizeTime: '12414',
        prizeName: '124124',
        level: '12',
        remark: '12414'
      }],
      addPrizeForm: {},
      modifyPrizeForm: {}
    }
  },
  created() {
    getUserPrizes().then(res => {
      console.log(res)
      this.prizeList = res
    })
  },
  methods: {
    addPrize() {
      addPrize(this.addPrizeForm).then(res => {
        console.log('新增奖项', this.addPrizeForm)
      })
      getUserPrizes().then(res => {
        this.prizeList = res
      })
    },
    modifyPrize(data) {
      console.log(data)
      this.modifyPrizeDialogueVisible = true
      this.modifyPrizeForm = JSON.parse(JSON.stringify(data))
    }
  }
}
</script>

<style scoped>

</style>
