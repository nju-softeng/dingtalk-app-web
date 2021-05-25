<template>
  <div class="audit">
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
              <h6>{{ item.key }}</h6>
              <p style="white-space: pre-line; font-size:14px">
                <span v-html="formathtml(item.value)" />
              </p>
            </div>
            <div v-if="report == null" class="center">
              <div style="margin:8px 0px ">
                <svg-icon icon-class="null" style="font-size:32px" /> <br>
              </div>
              <div style="margin-bottom:32px;color:#8c8c8c;font-size:12px;line-height:20px">
                未获取到周报内容,可能原因：
                <li>bug</li>
                <li>申请人未在指定时间提交周报</li>
                <li>申请人选择未选择正确的周</li>
              </div>
            </div>
          </div>

          <el-divider />

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
                  <span v-else :class="{ text_span: !row.status }">{{
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
              <template slot="empty">
                <div style="height:100px;">
                  <div style="margin-top:10px;">
                    <svg-icon icon-class="null" style="font-size:32px" />
                  </div>
                  <div style="line-height: 10px;">
                    <span>没有AC申请</span>
                  </div>
                </div>
              </template>
            </el-table>
          </div>
        </div>

        <div style="height:78px;" />

        <div class="drawer_foot">
          <div style="padding:12px 8px 4px;font-size:12.5px">
            <span style="margin-right:8px">{{ temp.name }} </span>
            <span>D值: {{ temp.dvalue }}</span>
            <span style="padding-left:20px">DC值: {{ form.dc || "--" }}</span>
            <span style="padding-left:20px;color:red">累计AC值: {{ form.ac || "--" }}</span>
          </div>

          <div style="padding:8px 8px;font-size:12.5px">
            <span> C值：</span>

            <el-input v-model="form.cvalue" style="width:100px; margin-right:10px" placeholder="请输入内容" @input="valChange" />

            <el-button type="primary" size="mini" @click="submit">确认提交</el-button>
            <el-button size="mini" @click="prev">上一条</el-button>
            <el-button size="mini" @click="next">下一条</el-button>
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

          <div style="width:60%; min-height:100px; background-color:#fafafa;padding:10px; font-size:12px; line-height:20px">
            <div v-if="activeAcItems.length != 0">
              <span> 通过的ac申请:</span>

              <li v-for="(item, index) in activeAcItems" :key="index">
                {{ item.reason }} - - - - {{ item.ac }}
              </li>
            </div>
            <div v-else>
              <div style="height:100px;" class="center">
                <div style="margin-top:10px; ">
                  <svg-icon icon-class="null" style="font-size:32px" /> <br>
                </div>
                <div style="line-height: 10px;">
                  <span>无AC申请</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="drawer_foot" style="height:48px">
          <div style="padding:8px 8px;font-size:12.5px">
            <el-button type="primary" style="width:64%" size="mini" @click="carryOn">下一条</el-button>
            <el-button style="width:33%" size="mini" @click="check = !check">编辑</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { fetchReport, submitAudit } from '@/api/audit'
export default {
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
        cvalue: [{ required: true, message: '请输入C值', trigger: 'blur' }]
      }
    }
  },
  computed: {
    activeAcItems() {
      return this.form.acItems.filter(item => item.status)
    }
  },
  watch: {
    show() {
      this.visible = this.show
      if (this.visible === false) {
        this.$emit('drawer-event', 'close')
      }
    },
    temp() {
      this.initData()
      this.check = true
    }
  },
  methods: {
    formathtml(str) {
      return str.replace(/\r\n\r\n/g, '<br/>')
    },
    valChange() {
      this.form.dc = Number((this.form.cvalue * this.temp.dvalue).toFixed(4))
    },
    submit() {
      console.log(this.form)
      var regPos = /^\d+(\.\d+)?$/ // 正则表达式，是否为数字
      if (!regPos.test(this.form.cvalue)) {
        this.$message({
          showClose: true,
          message: '请输入正确 C值',
          type: 'error'
        })
        return
      }
      submitAudit(this.form).then(() => {
        this.check = false
        this.$emit('drawer-event', 'submit')
      })
    },
    carryOn() {
      this.$emit('drawer-event', 'continue')
    },
    next() {
      this.$emit('drawer-event', 'next')
    },
    prev() {
      this.$emit('drawer-event', 'prev')
    },
    initData() {
      this.form.cvalue = this.temp.cvalue
      this.form.dc = Number((this.form.cvalue * this.temp.dvalue).toFixed(4))
      this.form.id = this.temp.id
      // 深拷贝
      const tmp = JSON.parse(JSON.stringify(this.temp.acItems))
      // 给每一条ac申请添加编辑和拒绝属性
      this.form.acItems = tmp.map(v => {
        this.$set(v, 'edit', false)
        this.$set(v, 'reject', false)
        v.originalAc = v.ac
        v.status = true
        return v
      })
      this.form.ac = this.form.acItems
        .filter(item => item.status === true)
        .reduce((sum, item) => sum + item.ac, 0)
      this.form.ac = Number(this.form.ac.toFixed(4))
      fetchReport(this.temp.uid, new Date(this.temp.weekdate)).then(res => {
        this.report = res.data.contents
      })
    },
    cancelEdit(row) {
      row.ac = row.originalAc
      row.edit = false
      this.$message({
        message: 'The title has been restored to the AC value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.ac *= 1
      row.originalAc = row.ac
      this.form.ac = this.form.acItems
        .filter(item => item.status === true)
        .reduce((sum, item) => sum + item.ac, 0)
      this.form.ac = Number(this.form.ac.toFixed(4))
      this.$message({
        message: 'The AC has been edited',
        type: 'success'
      })
    },
    rejectAcRow(row) {
      row.reject = !row.reject
      row.status = !row.status
      this.form.ac = this.form.acItems
        .filter(item => item.status === true)
        .reduce((sum, item) => sum + item.ac, 0)
      this.form.ac = Number(this.form.ac.toFixed(4))
    }
  }
}
</script>

<style lang="scss" scoped>
.ac-card /deep/ .el-table__row > td {
  border: none;
}

.submitted {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.audit /deep/ .el-drawer__header {
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.report {
  padding: 0px 20px 10px;
}

.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.drawer_foot {
  box-shadow: 0px -1px 2px #fafafa;
  border-top: solid 0.5px #d9d9d9;
  height: 78px;
  background-color: white;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-left: 8px;
  z-index: 100;
}

.text_span {
  text-decoration: line-through;
  color: #d9d9d9;
}

/deep/ ::-webkit-scrollbar {
  width: 0px;
}

h6 {
  font-size: 14px;
  line-height: 24px;
  font-weight: normal;
  margin: 4px 0 2px 0;
}

p {
  line-height: 1.74;
  font-size: 14px;
  color: #262626;
  letter-spacing: 0.05em;
  word-wrap: break-word;
  display: block;
  margin: 0;
}

.item {
  padding: 4px 0;
}
</style>
