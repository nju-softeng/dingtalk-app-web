<template>
  <div style="display:flex">
    <el-card class="box-card" style="width:99%; height: 600px;margin-right:5px" shadow="never">
      <div v-if="conflictList.length > 0" slot="header">
        <span>解决冲突数据</span>
      </div>
      <el-table v-if="conflictList.length > 0" max-height="550px" :data="conflictList" :row-style="{ height: '41px' }">
        <el-table-column label="AC ID"  width="80px" align="center">
          <template slot-scope="{ row }">
            {{ row.mysqlData.id }} <span> &nbsp; </span> <br> {{ row.fabricData.id }} <span> &nbsp; </span>
          </template>
        </el-table-column>
        <el-table-column label="AC值"  width="80px" align="center">
          <template slot-scope="{ row }">
            {{ row.mysqlData.ac }} <span> &nbsp; </span> <br> {{ row.fabricData.ac }} <span> &nbsp; </span>
          </template>
        </el-table-column>
        <el-table-column label="类别"  width="80px" align="center">
          <template slot-scope="{ row }">
            {{ row.mysqlData.classify }} <span> &nbsp; </span> <br> {{ row.fabricData.classify }} <span> &nbsp; </span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间"  width="200px" align="center">
          <template slot-scope="{ row }">
            {{ row.mysqlData.createTime }} <span> &nbsp; </span> <br> {{ row.fabricData.createTime }} <span> &nbsp; </span>
          </template>
        </el-table-column>
        <el-table-column label="申请原因"  min-width="200px" align="center">
          <template slot-scope="{ row }">
            {{ row.mysqlData.reason }} <span> &nbsp; </span> <br> {{ row.fabricData.reason }} <span> &nbsp; </span>
          </template>
        </el-table-column>
        <el-table-column label="审核人ID"  width="80px" align="center">
          <template slot-scope="{ row }">
            {{ row.mysqlData.auditor.id }} <span> &nbsp; </span> <br> {{ row.fabricData.auditor.id }} <span> &nbsp; </span>
          </template>
        </el-table-column>
        <el-table-column label="用户ID"  width="80px" align="center">
          <template slot-scope="{ row }">
            {{ row.mysqlData.user.id }} <span> &nbsp; </span> <br> {{ row.fabricData.user.id }} <span> &nbsp; </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px" align="center">
          <template slot-scope="{ row, $index }">
            <el-tooltip effect="dark" content="保留MySQL数据" placement="top">
              <el-popconfirm
                icon="el-icon-warning-outline"
                icon-color="red"
                title="确定保留MySQL数据？"
                @confirm="chooseOne(row, 'mysql', $index)"
              >
                <el-button slot="reference" icon="el-icon-top" style="padding: 2px 6px 2px 6px; font-size: 12px; margin-bottom: 3px" />
              </el-popconfirm>
            </el-tooltip>
            <br>
            <el-tooltip effect="dark" content="保留区块链数据" placement="bottom">
              <el-popconfirm
                icon="el-icon-warning-outline"
                icon-color="red"
                title="确定保留区块链数据？"
                @confirm="chooseOne(row, 'fabric', $index)"
              >
                <el-button slot="reference" icon="el-icon-bottom" style="padding: 2px 6px 2px 6px; font-size: 12px"/>
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div v-else style="display: flex; vertical-align: middle; height: 600px; justify-content: center">
        <div v-loading style="display: flex; align-items: center; width:100%; justify-content: center; font-size: 24px; flex-direction: column">
          <div>
            <i v-if="verifying === true" class="el-icon-loading" />
            <i v-else-if="tipText === '请点击按钮进行核验'" class="el-icon-warning-outline" />
            <i v-else class="el-icon-circle-check" style="color: #32ff64" />
            <span style="margin-left: 10px">{{ tipText }}</span>
          </div>
          <div style="margin-top: 20px">
            <el-button style="font-size: 16px; padding: 10px 20px" :disabled="verifying" @click="startVerify">{{ buttonText }}</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import {
  verifyData,
  decideConflict
} from '@/api/verification'
export default {
  data() {
    return {
      conflictList: [],
      tipText: '请点击按钮进行核验',
      buttonText: '开始核验',
      verifying: false
    }
  },
  created() {},
  methods: {
    startVerify() {
      this.verifying = true
      this.tipText = '核验中……'
      verifyData().then(res => {
        console.log(res)
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].mysqlData === undefined) {
            res.data[i].mysqlData = {
              id: null,
              ac: null,
              classify: null,
              createTime: null,
              reason: null,
              auditor: { id: null },
              user: { id: null }
            }
          } else if (res.data[i].mysqlData.auditor === undefined) {
            res.data[i].mysqlData.auditor = { id: null }
          }
          if (res.data[i].fabricData === undefined) {
            res.data[i].fabricData = {
              id: null,
              ac: null,
              classify: null,
              createTime: null,
              reason: null,
              auditor: { id: null },
              user: { id: null }
            }
          } else if (res.data[i].fabricData.auditor === undefined) {
            res.data[i].fabricData.auditor = { id: null }
          }
        }
        if (res) {
          this.verifying = false
          this.conflictList = res.data
          if (this.conflictList.length === 0) {
            this.tipText = '验证通过！'
            this.buttonText = '再次核验'
          }
        }
      }).catch(err => {
        this.$message.error('验证失败')
        console.log(err)
      })
    },

    chooseOne(row, choice, index) {
      row.choice = choice
      decideConflict(row).then(res => {
        if (res) {
          this.conflictList.splice(index, 1)
          if (this.conflictList.length === 0) {
            this.tipText = '已解决全部冲突！'
            this.buttonText = '再次核验'
          }
          this.$message.success('已解决冲突！')
        }
      }).catch(err => {
        this.$message.error('解决冲突失败！')
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .box-card {
    ::v-deep .el-card__body {
      padding: 5px 20px 10px;
      font-size: 14px;
    }
  }

  li {
    padding-bottom: 4px;
    font-size: 12px;
  }
</style>
