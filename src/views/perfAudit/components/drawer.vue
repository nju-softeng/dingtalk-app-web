<template>
  <div class="drawer">
    <el-drawer :visible.sync="visible" size="50%" :modal="false" @close="$emit('update:show', false)">
      <!-- 标题 -->
      <div slot="title">
        <transition name="fade">
          <div v-show="!load">
            <span style="margin-right:8px">{{ temp.name }} 的申请</span>
            <el-tag>{{ temp.yearmonth | formatWeek(temp.week) }}</el-tag>
          </div>
        </transition>
      </div>
      <div v-if="check">
        <div v-loading="load">
          <!-- 周报 -->
          <div class="report">
            <div v-for="(item, index) in report" :key="index" class="item">
              <li>{{ item.key }}</li>
              <p style="white-space: pre-line">{{ item.value }}</p>
            </div>
            <div v-if="report == null" class="report_null">
              <div style="margin:16px 0;">
                <svg-icon icon-class="null" style="font-size:32px" /> <br />
              </div>
              <div style="color:#8c8c8c;font-size:12px;line-height:20px">
                未获取到周报内容,可能原因：
                <li>bug</li>
                <li>申请人未在指定时间提交周报</li>
                <li>申请人选择未选择正确的周</li>
              </div>
            </div>
          </div>

          <el-divider></el-divider>

          <div class="ac-card">
            <el-table :data="form.acItems" tooltip-effect="dark">
              <el-table-column label="AC申请理由">
                <template slot-scope="{ row }">
                  <span :class="{ text_span: !row.status }">{{
                    row.reason
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="AC" align="center">
                <template slot-scope="{ row }">
                  <template v-if="row.edit">
                    <el-input v-model="row.ac" style="width:50px" />
                  </template>
                  <span :class="{ text_span: !row.status }" v-else>{{
                    row.ac
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <template v-if="row.edit">
                    <el-button type="text" size="small" icon="el-icon-circle-check-outline" @click="confirmEdit(row)">
                      确定
                    </el-button>
                    <el-button type="text" size="small" @click="cancelEdit(row)">
                      取消
                    </el-button>
                  </template>
                  <template v-else>
                    <el-button type="text" :disabled="row.reject" size="small" icon="el-icon-edit" @click="row.edit = !row.edit">
                      修改
                    </el-button>
                    <el-button v-if="!row.reject" type="text" size="small" @click.native.prevent="rejectAcRow(row)">拒绝</el-button>
                    <el-button v-if="row.reject" type="text" size="small" @click.native.prevent="rejectAcRow(row)">恢复</el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin:12px 0 4px 8px;font-size:12px">
              <span style="color:red">累计AC值：{{ form.ac || "--" }}</span>
            </div>
          </div>
        </div>

        <div style="height:78px;"></div>

        <div class="drawer_foot">
          <div style="padding:8px 8px;font-size:12.5px">
            <span style="margin-right:8px">{{ temp.name }} </span>
            <span>D值: {{ temp.dvalue }}</span>
            <span style="padding-left:20px">DC值: {{ form.dc || "--" }}</span>
            <span style="padding-left:20px">AC值: {{ form.ac || "--" }}</span>
          </div>

          <div style="padding:8px 8px;font-size:12.5px">
            <span> C值：</span>

            <el-input @input="valChange" v-model="form.cvalue" style="width:100px; margin-right:10px" placeholder="请输入内容"></el-input>

            <el-button @click="sendAudit" type="primary" size="mini">确认提交</el-button>
            <el-button @click="prev" size="mini">上一条</el-button>
            <el-button @click="next" size="mini">下一条</el-button>
          </div>
        </div>
      </div>
      <!-- 审核后，显示结果页 -->
      <div v-else>
        <div class="submitted">
          <div style="margin-top:48px; text-align:center">
            <div style="text-align:center;padding-bottom:16px">
              <svg-icon icon-class="success" style="font-size:32px;" />
            </div>
            <div style="font-size:15px">
              {{ temp.name }}
              的绩效已审核
            </div>

            <div style="font-size:15px">
              <p>
                <span style="padding:8px">DC值: {{ form.dc }}</span>
                <span style="padding:8px">AC值: {{ form.ac }}</span>
              </p>
            </div>
          </div>

          <div style="width:60%; min-height:100px; background-color:#fafafa;padding:10px; font-size:12.5px">
            <span> 通过的ac申请</span>
            <ol>
              <li v-for="(item, index) in activeAcItems" :key="index">
                {{ item.reason }} ---- {{ item.ac }}
              </li>
            </ol>
          </div>
        </div>

        <div class="drawer_foot" style="height:48px">
          <div style="padding:8px 8px;font-size:12.5px">
            <el-button @click="next" type="primary" style="width:64%" size="mini">下一条</el-button>
            <el-button @click="check = !check" style="width:33%" size="mini">编辑</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { fetchReport, submitAudit } from "@/api/audit";
export default {
  data() {
    return {
      visible: this.show,
      loading: false,
      span_style: true,
      check: true,
      report: null,
      form: {
        id: null,
        cvalue: null,
        dc: null,
        ac: null,
        acItems: []
      },
      rules: {
        cvalue: [{ required: true, message: "请输入C值", trigger: "blur" }]
      }
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    temp: {
      type: Object
    },
    load: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show() {
      this.visible = this.show;
    },
    temp() {
      this.initData();
      this.check = true;
    },
    "form.cvalue"() {
      console.log(this.form.dc);
    }
  },
  computed: {
    activeAcItems() {
      return this.form.acItems.filter(item => item.status);
    }
  },
  methods: {
    valChange() {
      this.form.dc = Number((this.form.cvalue * this.temp.dvalue).toFixed(4));
    },
    sendAudit() {
      console.log(this.form);
      var regPos = /^\d+(\.\d+)?$/; // 正则表达式，是否为数字
      if (!regPos.test(this.form.cvalue)) {
        this.$message({
          showClose: true,
          message: "请输入正确 C值",
          type: "error"
        });
        return;
      }
      submitAudit(this.form).then(() => {
        this.$notify({
          title: "成功",
          message:
            this.temp.name +
            "  DC值：" +
            this.form.dc +
            "  AC值：" +
            this.form.ac,
          type: "success"
        });
        this.check = false;
        // this.$emit("drawer-event", "submit");
      });
    },
    next() {
      this.$emit("drawer-event", "next");
    },
    prev() {
      this.$emit("drawer-event", "prev");
    },
    initData() {
      this.form.cvalue = this.temp.cvalue;
      this.form.id = this.temp.id;
      // 深拷贝
      let tmp = JSON.parse(JSON.stringify(this.temp.acItems));
      // 给每一条ac申请添加编辑和拒绝属性
      this.form.acItems = tmp.map(v => {
        this.$set(v, "edit", false);
        this.$set(v, "reject", false);
        v.originalAc = v.ac;
        v.status = true;
        return v;
      });
      this.form.ac = this.form.acItems
        .filter(item => item.status === true)
        .reduce((sum, item) => sum + item.ac, 0);
      this.form.ac = Number(this.form.ac.toFixed(4));
      fetchReport(this.temp.uid, this.temp.weekdate).then(res => {
        this.report = res.data.contents;
      });
    },
    cancelEdit(row) {
      row.ac = row.originalAc;
      row.edit = false;
      this.$message({
        message: "The title has been restored to the AC value",
        type: "warning"
      });
    },
    confirmEdit(row) {
      row.edit = false;
      row.ac *= 1;
      row.originalAc = row.ac;
      this.form.ac = this.form.acItems
        .filter(item => item.status === true)
        .reduce((sum, item) => sum + item.ac, 0);
      this.form.ac = Number(this.form.ac.toFixed(4));
      this.$message({
        message: "The AC has been edited",
        type: "success"
      });
    },
    rejectAcRow(row) {
      row.reject = !row.reject;
      row.status = !row.status;
      this.form.ac = this.form.acItems
        .filter(item => item.status === true)
        .reduce((sum, item) => sum + item.ac, 0);
      this.form.ac = Number(this.form.ac.toFixed(4));
    }
  }
};
</script>

<style lang="scss" scoped>
.submitted {
  display: flex;

  align-items: center;
  flex-direction: column;
}

.drawer /deep/ .el-drawer__header {
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.report {
  padding: 20px;
}

.report_null {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.drawer_foot {
  border-top: solid 0.5px #d9d9d9;
  height: 78px;
  background-color: white;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-left: 8px;
}

.text_span {
  text-decoration: line-through;
  color: #d9d9d9;
}

::-webkit-scrollbar {
  width: 0px;
}

p {
  word-wrap: break-word;
}

.item {
  padding: 4px 0;
}
</style>
