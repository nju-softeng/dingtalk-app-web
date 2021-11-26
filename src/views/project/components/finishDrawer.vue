<template>
  <div class="drawer">
    <!-- 添加迭代drawer -->
    <el-drawer size="82%" :visible.sync="visible" direction="btt" @open="handleOpen" @closed="handleClosed" @close="$emit('update:show', false)">
      <div slot="title">{{ title }} - 第{{ serial }}次迭代</div>
      <div class="content">
        <el-card shadow="never" style="width:360px;margin-right:5px;">
          <div style="font-size:14px">
            <p style="margin-bottom:10px; margin-top:0px">完成时间</p>
            <el-date-picker v-model="finishdate" type="date" style="width:200px" value-format="yyyy-MM-dd" :picker-options="{ firstDayOfWeek: 1 }" placeholder="选择日期" @change="changeFinishTime" />
            <p>
              预计周期:
              <span style="font-size:12px">{{ iterate.beginTime }} ~ {{ iterate.endTime }}</span>
            </p>
            <el-divider />
            <div v-if="finishdate != undefined">
              <p>实际团队AC: {{ tmp.AcActual.toFixed(3) }}</p>
              <p>延误扣除AC: {{ tmp.AcReduce.toFixed(3) }}</p>
              <p>交付奖励AC: {{ tmp.AcAward.toFixed(3) }}</p>
              <p>最终团队AC: {{ tmp.totalAc.toFixed(3) }}</p>
            </div>
            <div v-else style="padding:10px;padding-top:20px;background-color:#f5f5f5;height:120px;" />
          </div>
        </el-card>

        <el-card v-if="finishdate != undefined" shadow="never" style="width:100%">
          <div style="font-size:14px">
            <!-- radio-group -->
            <div style="margin-bottom: 20px">
              <el-radio-group v-model="radio" size="mini" @change="tabChange">
                <el-radio-button label="true"> 默认方案</el-radio-button>
                <el-radio-button label="false">自定义</el-radio-button>
              </el-radio-group>
            </div>
            <!-- 自动计算 -->
            <div v-show="scheme">
              <div v-if="tmp.status">
                <div>
                  <p>迭代所跨周: {{ tmp.period }}</p>
                  <p style="white-space: pre;">其中: {{ tmp.info }}</p>
                </div>
                <div>
                  <div style="display:flex;">
                    <div style="width:80px;">
                      <table width="100%">
                        <tr>
                          <td class="black_title">#</td>
                        </tr>
                        <tr>
                          <td class="left_title bottom_border">周平均DC</td>
                        </tr>
                      </table>
                    </div>
                    <div v-for="(item, index) in tmp.iterateInfos" :key="index" style="width: 80px ;">
                      <table width="100%">
                        <tr>
                          <td class="black_title">{{ item.name }}</td>
                        </tr>
                        <tr>
                          <td class="left_title bottom_border">
                            {{ item.dc.toFixed(3) }}
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div style="width:80px;">
                      <table width="100%">
                        <tr>
                          <td class="black_title">平均DC和</td>
                        </tr>
                        <tr>
                          <td class="left_title bottom_border">
                            {{ tmp.dcSum.toFixed(3) }}
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
                <div>
                  <p>最终个人AC</p>
                  <div style="display:flex">
                    <el-card v-for="(item, index) in tmp.iterateInfos" :key="index" shadow="never" style="width:160px; margin-right:5px">
                      {{ item.name }} : {{ item.ac.toFixed(3) }}
                    </el-card>
                  </div>
                </div>
                <div style="margin-top:20px">
                  <el-button @click="setIterationAC">确定提交</el-button>
                </div>
              </div>
              <div v-else>
                <el-alert title="开发者的DC和为0，公式无法计算，请手动分配" type="error" />
              </div>
            </div>
            <!-- 手动分配 -->
            <div v-show="!scheme">
              <el-card shadow="never">
                <el-form label-width="70px" label-position="right">
                  <el-form-item v-for="(o, index) in iterate.iterationDetails" :key="index" :label="o.user.name">
                    <el-input v-model="o.ac" style="width:100px" />
                  </el-form-item>
                </el-form>
                <div style="margin-top:20px">
                  <el-button @click="manualAc">确定提交</el-button>
                </div>
              </el-card>
            </div>
          </div>
        </el-card>
        <!-- 未确定完成时间的空提示 -->
        <el-card
          v-show="finishdate == undefined"
          shadow="never"
          style="width:100%; display:flex; justify-content: center;
        align-items: center; "
        >
          <div style="padding:10px;text-align:center;">
            暂无迭代绩效数据
          </div>
          <div style="height:180px; width:500px; background-color:#f5f5f5; font-size:14px;display:flex; justify-content: center;align-items: center; ">
            <div>
              <span style="padding-right:10px">完成时间</span>

              <el-date-picker v-model="finishdate" type="date" value-format="yyyy-MM-dd" :picker-options="{ firstDayOfWeek: 1 }" placeholder="选择日期" @change="changeFinishTime" />
              <p>请在周日审核完DC后,再结算</p>
            </div>
          </div>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { computeIterateAc, autoSetAc, manualSetAc } from '@/api/project.js'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    iterate: {
      type: Object
    },
    modify: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    serial: {
      type: Number
    }
  },
  data() {
    return {
      visible: this.show,
      radio: true,
      scheme: true,
      finishdate: null,
      list: [],
      tmp: {
        AcActual: 0,
        AcReduce: 0,
        AcAward: 0,
        totalAc: 0,
        dcSum: 0,
        iterateInfos: []
      }
    }
  },
  watch: {
    show() {
      this.visible = this.show
    }
  },
  methods: {
    changeFinishTime() {
      if (this.finishdate != undefined) {
        console.log(this.iterate.id, this.finishdate)
        computeIterateAc(this.iterate.id, this.finishdate).then(res => {
          console.log(res.data)
          this.tmp = res.data
        })
      }
    },
    setIterationAC() {
      autoSetAc(this.iterate.id, this.finishdate).then(res => {
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        this.$emit('submitted', true)
        this.drawer = false
      })
    },
    manualAc() {
      var data = {
        finishdate: this.finishdate,
        iterationDetails: this.iterate.iterationDetails
      }
      console.log(data)
      manualSetAc(this.iterate.id, data).then(() => {
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        this.$emit('submitted', true)
        this.drawer = false
      })
    },
    tabChange() {
      this.scheme = !this.scheme
    },
    handleOpen() {
      this.finishdate = null
      this.radio = true
      this.scheme = true

      if (this.modify) {
        this.finishdate = this.iterate.finishTime
        computeIterateAc(this.iterate.id, this.finishdate).then(res => {
          this.tmp = res.data
          console.log(this.tmp)
        })
      }
    },

    handleClosed() {
      this.tmp = {
        AcActual: 0,
        AcReduce: 0,
        AcAward: 0,
        totalAc: 0,
        dcSum: 0,
        iterateInfos: []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.drawer ::v-deep .el-drawer > header > span:focus {
  outline-color: white;
}
.drawer ::v-deep .el-drawer__title {
  margin-bottom: 0px;
}

.drawer ::v-deep .el-drawer__header {
  margin-bottom: 15px;
}
.drawer ::v-deep .el-drawer > header > button:focus {
  outline-color: white;
}
.drawer ::v-deep .el-drawer > header > button:hover {
  outline-color: white;
}

.content {
  padding: 0 20px;
  height: 100%;
  display: flex;
}

table,
table tr th,
table tr td {
  border: 1px solid #ccc;
  padding: 5px;
}

table {
  border-collapse: collapse;
}
</style>
