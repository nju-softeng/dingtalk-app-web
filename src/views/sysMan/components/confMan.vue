<template>
  <div style="display:flex">
    <el-card class="box-card" style="width:50%; height: 260px;margin-right:5px" shadow="never">
      <div slot="header">
        <span>津贴标准</span>
        <el-button v-if="flag1" style="float: right; padding: 3px 0" type="text" @click="flag1 = false">编辑</el-button>
        <el-button
          v-else
          style="float: right; padding: 3px 0"
          type="text"
          @click="
            flag1 = true;
            modifySubsidy();
          "
        >保存</el-button>
      </div>

      <el-table :data="subsidylist" :row-style="{ height: '41px' }">
        <el-table-column label="在读学位" prop="position" />
        <el-table-column label="津贴标准" align="center">
          <template slot-scope="{ row }">
            <span v-if="flag1"> {{ row.subsidy }} 元 / 周</span>
            <el-input v-else v-model="row.subsidy" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card" style="width:50%; height: 500px;" shadow="never">
      <div slot="header">
        <span>论文AC标准</span>
        <el-button v-if="flag2" style="float: right; padding: 3px 0" type="text" @click="flag2 = false">编辑</el-button>
        <el-button
          v-else
          style="float: right; padding: 3px 0"
          type="text"
          @click="
            flag2 = true;
            modfiyPaperLevel();
          "
        >保存</el-button>
      </div>

      <el-table :data="paperlevels" :row-style="{ height: '41px' }">
        <el-table-column label="论文类别" prop="title" />
        <el-table-column label="总AC标准" align="center">
          <template slot-scope="{ row }">
            <span v-if="flag2"> {{ row.total }} </span>
            <el-input v-else v-model="row.total" />
          </template>
        </el-table-column>
      </el-table>
      <p style="color:#434343">
        <i class="el-icon-warning" />
        AC分配规则
        <ul style="padding-left:16px;padding-top:0px">
          <li>1st author : 50%</li>
          <li>2nd author : 25%</li>
          <li>3rd author : 15%</li>
          <li>other share : 10%</li>
        </ul>
      </p>
    </el-card>
  </div>
</template>
<script>
import {
  listSubsidy,
  updateSubsidy,
  listPaperLevel,
  updatePaperLevel
} from '@/api/system'
export default {
  data() {
    return {
      flag1: true,
      flag2: true,
      subsidylist: [],
      paperlevels: []
    }
  },
  created() {
    listSubsidy().then(res => {
      this.subsidylist = res.data
    })
    listPaperLevel().then(res => {
      this.paperlevels = res.data
    })
  },
  methods: {
    // 更新绩效标准
    modifySubsidy() {
      updateSubsidy(this.subsidylist).then(() => {
        this.$notify({
          title: '成功',
          message: '绩效标准保存成功',
          position: 'bottom-right',
          type: 'success'
        })
      })
    },
    // 更新论文AC标准
    modfiyPaperLevel() {
      updatePaperLevel(this.paperlevels).then(() => {
        this.$notify({
          title: '成功',
          message: '论文标准保存成功',
          position: 'bottom-right',
          type: 'success'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.box-card {
  /deep/ .el-card__body {
    padding: 5px 20px 10px;
    font-size: 14px;
  }
}
li {
  padding-bottom: 4px;
  font-size: 12px;
}
</style>
