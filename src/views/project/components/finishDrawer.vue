<template>
  <div class="drawer">
    <!-- 添加迭代drawer -->
    <el-drawer @open="handleOpen" size="80%" :visible.sync="drawer" direction="btt">
      <div slot="title">项目标题</div>
      <div class="content">
        <el-card shadow="never" style="width:360px;margin-right:5px;">
          <div style="font-size:14px">
            <p style="margin-bottom:10px; margin-top:0px">完成时间</p>
            <el-date-picker type="date" style="width:200px" v-model="finishdate" @change="changeFinishTime" value-format="yyyy-MM-dd" :picker-options="{ firstDayOfWeek: 1 }" placeholder="选择日期">
            </el-date-picker>
            <p>
              预计周期:
              <span style="font-size:12px">{{ iterate.beginTime }} ~ {{ iterate.endTime }}</span>
            </p>
            <el-divider></el-divider>
            <div v-if="finishdate != undefined">
              <p>实际团队AC: {{ tmp.AcActual.toFixed(3) }}</p>
              <p>延误扣除AC: {{ tmp.AcReduce.toFixed(3) }}</p>
              <p>交付奖励AC: {{ tmp.AcAward.toFixed(3) }}</p>
              <p>最终团队AC: {{ tmp.totalAc.toFixed(3) }}</p>
            </div>
            <div v-else style="padding:10px;padding-top:20px;background-color:#f5f5f5;height:120px;"></div>
          </div>
        </el-card>

        <el-card v-if="finishdate != undefined" shadow="never" style="width:100%">
          <div style="font-size:14px">
            <div style="margin-bottom: 20px">
              <el-radio-group v-model="radio" @change="tabChange" size="mini">
                <el-radio-button label="true"> 默认方案</el-radio-button>
                <el-radio-button label="false">自定义</el-radio-button>
              </el-radio-group>
            </div>
            <div v-show="scheme">
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
            <div v-show="!scheme">
              <el-card shadow="never">
                <el-form label-width="70px" label-position="right">
                  <el-form-item v-for="(o, index) in iterate.iterationDetails" :key="index" :label="o.user.name">
                    <el-input v-model="o.ac" style="width:100px"></el-input>
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
        <el-card v-show="finishdate == undefined" shadow="never" style="width:100%; display:flex; justify-content: center;            
        align-items: center; ">
          <div style="padding:10px;text-align:center;">
            暂无迭代绩效数据
          </div>
          <div style="height:180px; width:500px; background-color:#f5f5f5; font-size:14px;display:flex; justify-content: center;align-items: center; ">
            <div>
              <span style="padding-right:10px">完成时间</span>

              <el-date-picker @change="changeFinishTime" v-model="finishdate" type="date" value-format="yyyy-MM-dd" :picker-options="{ firstDayOfWeek: 1 }" placeholder="选择日期">
              </el-date-picker>
              <p>请在周日审核完DC后,再结算</p>
            </div>
          </div>
        </el-card>
      </div>
      {{ iterate }}
    </el-drawer>
  </div>
</template>
<script>
import { computeIterateAc, autoSetAc, manualSetAc } from "@/api/project.js";

export default {
  props: ["iterate", "modify"],
  data() {
    return {
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
    };
  },
  computed: {
    drawer: {
      get() {
        return this.$store.state.project.finishdrawer;
      },
      set(value) {
        this.$store.commit("project/UPDATE_DRAWER", value);
      }
    }
  },
  methods: {
    changeFinishTime() {
      if (this.finishdate != undefined) {
        computeIterateAc(this.iterate.id, this.finishdate).then(res => {
          console.log(res.data);
          this.tmp = res.data;
        });
      }
    },
    setIterationAC() {
      autoSetAc(this.iterate.id, this.finishdate).then(res => {
        console.log(res);
      });
    },
    manualAc() {
      var data = {
        finishdate: this.finishdate,
        iterationDetails: this.iterate.iterationDetails
      };
      console.log(data);
      manualSetAc(this.iterate.id, data).then(() => {
        this.$notify({
          title: "成功",
          type: "success"
        });
      });
    },
    tabChange() {
      this.scheme = !this.scheme;
    },
    handleOpen() {
      this.finishdate = null;
      this.radio = true;
      this.scheme = true;
    }

    // handleClose() {
    //   this.$refs.iterateform.resetFields();
    //   this.userlist = [];
    //   this.iterateform.updateDingIds = false;
    //   this.iterateform.id = null;
    // }
  }
};
</script>
<style lang="scss" scoped>
.drawer /deep/ .el-drawer > header > span:focus {
  outline-color: white;
}
.drawer /deep/ .el-drawer__title {
  margin-bottom: 0px;
}

.drawer /deep/ .el-drawer__header {
  margin-bottom: 0px;
}
.drawer /deep/ .el-drawer > header > button:focus {
  outline-color: white;
}
.drawer /deep/ .el-drawer > header > button:hover {
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
