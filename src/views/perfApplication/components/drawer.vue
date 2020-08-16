<template>
  <div class="apply">
    <el-drawer
      :direction="direction"
      :modal="false"
      :visible.sync="visible"
      @close="$emit('update:show', false)"
      @closed="emptyForm"
      size="380px"
    >
      <div slot="title" style="font-size:14px">{{ title }}</div>

      <div class="drawer-content">
        <!-- dc表单 -->
        <el-form
          :model="form"
          label-width="90px"
          :rules="rules"
          ref="form"
          label-position="left"
        >
          <el-form-item prop="auditorid">
            <span slot="label"> <svg-icon icon-class="people" /> 审核人</span>
            <el-select
              style="width:210px"
              v-model="form.auditorid"
              placeholder="请选择审核人"
            >
              <el-option
                v-for="(item, index) in auditors"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="dvalue">
            <span slot="label"> <svg-icon icon-class="dvalue" /> D值</span>
            <el-input v-model="form.dvalue" style="width:210px"></el-input>
          </el-form-item>
          <el-form-item prop="cvalue" v-if="showCvalue">
            <span slot="label"> <svg-icon icon-class="dvalue" /> C值</span>
            <el-input v-model="form.cvalue" style="width:210px"></el-input>
          </el-form-item>
          <el-form-item prop="date">
            <span slot="label"> <svg-icon icon-class="week" /> 申请周</span>
            <el-date-picker
              v-show="!form.date"
              v-model="form.date"
              style="width:210px"
              type="week"
              value-format="yyyy-MM-dd"
              format="yyyy 第 WW 周"
              placeholder="选择周"
              :picker-options="{ firstDayOfWeek: 1 }"
              @change="getDate"
            ></el-date-picker>
            <el-tag
              v-show="form.date"
              closable
              @close="closeTag"
              effect="plain"
              size="medium"
              style="font-size:12px;"
            >
              {{ monthWeek }}
            </el-tag>
          </el-form-item>
        </el-form>
        <!-- ac申请 -->
        <div>
          <div
            :label="index === 0 ? 'AC值' : ''"
            v-for="(item, index) in form.acItems"
            :key="index"
            style="margin : 5px 0px 5px 0px;display:flex"
          >
            <el-input
              v-model="item.reason"
              style="margin-right:3px;"
              placeholder="申请原因"
            ></el-input>
            <el-input
              v-model="item.ac"
              style="width:20%"
              placeholder="AC"
            ></el-input>

            <el-button
              style="border: 0px"
              icon="el-icon-delete"
              @click.prevent="rmAcItem(item)"
            />
          </div>
          <el-button
            @click="addAcItem"
            style="border-style:dashed; width:298px; "
            ><i class="el-icon-plus"></i> 添加AC申请
          </el-button>

          <br />
        </div>
      </div>

      <div class="drawer-footer">
        <el-button style="width:50%" @click="visible = false">取 消</el-button>
        <el-button
          style="width:50%"
          type="primary"
          @click="submit()"
          :loading="loading"
        >
          {{ loading ? "提交中 ..." : "确 定" }}</el-button
        >
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { submitApplication, getWeek } from "@/api/application";
export default {
  data() {
    return {
      title: "申请绩效",
      visible: this.show,
      monthWeek: "请选择报表申请所在在周",
      loading: false,
      status: false,
      showCvalue:false,
      form: {
        id: null,
        auditorid: null,
        date: "",
        dvalue: "",
        cvalue: "",
        acItems: []
      },
      rules: {
        auditorid: [
          { required: true, message: "请选择审核人", trigger: "change" }
        ],
        dvalue: [{ required: true, message: "请输入D值", trigger: "blur" }],
        cvalue: [{ required: true, message: "请输入C值", trigger: "blur" }],
        "acItems.reason": [
          { required: true, message: "请填写AC申请", trigger: "blur" }
        ],
        date: [
          { required: true, message: "请选择绩效所在周", trigger: "change" }
        ]
      }
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: "ltr"
    },
    tmp: {
      type: Object
    },
    auditors: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  watch: {
    show() {
      this.visible = this.show;
    },
    tmp() {
      if (this.tmp != null) {
        this.initModeify();
        this.title = "更新绩效";
      } else {
        let uid = parseInt(sessionStorage.getItem("uid"));
        let aids = this.auditors.map(x => x.id);
        if (aids.indexOf(uid) > -1) {
          this.form.auditorid = uid;
        }
        console.log(this.form);
      }
    },
    "form.auditorid"() {
      let uid = parseInt(sessionStorage.getItem("uid"));
      if (uid == this.form.auditorid) {
          this.showCvalue = true;
      } else {
        this.showCvalue = false;
      }
    }
  },
  methods: {
    // 清空表单
    emptyForm() {
      this.$refs["form"].resetFields();
      this.form.acItems = [];
      this.form.id = null;
      this.title = "申请绩效";
      this.tmp = null;
    },
    // 添加一个ac申请项
    addAcItem() {
      this.form.acItems.push({
        ac: null,
        reason: null
      });
    },
    // 删除ac申请项
    rmAcItem(item) {
      const index = this.form.acItems.indexOf(item);
      if (index !== -1) {
        this.form.acItems.splice(index, 1);
      }
    },
    // 修改时间选择器的日期
    getDate() {
      let date = new Date(this.form.date);
      this.form.date = new Date(date.setDate(date.getDate() + 2));
      getWeek(this.form.date).then(res => {
        let yearmonth = res.data[0];
        let week = res.data[1];
        this.monthWeek =
          yearmonth.toString().slice(4, 7) + " 月 第 " + week + " 周";
      });
    },
    closeTag() {
      this.form.date = "";
    },
    // 初始化修改数据
    initModeify() {
      this.$nextTick(() => {
        this.form.id = this.tmp.id;
        this.form.acItems = this.tmp.acItems;
        this.form.dvalue = this.tmp.dvalue;
        this.form.cvalue = this.tmp.cvalue;
        this.form.auditorid = this.tmp.auditorid;
        this.form.date = this.tmp.weekdate;
        this.form.acItems = this.tmp.acItems;
        this.monthWeek =
          this.tmp.yearmonth.toString().slice(4, 7) +
          " 月 第 " +
          this.tmp.week +
          " 周";

        console.log(this.monthWeek);
      });
    },
    // 提交申请
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 过滤 acItems 中为空的选项
          this.form.acItems = this.form.acItems.filter(item => item.ac != null);
          this.loading = true;

          submitApplication(this.form)
            .then(res => {
              console.log(res.data);
              // 通知父组件刷新
              this.$emit("submitted", "true");
              this.loading = false;
              this.visible = false;
              this.$notify({
                title: "成功",
                message: "申请提交成功",
                type: "success"
              });
              this.drawer = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.$notify({
            title: "提交失败",
            message: "请填充必要信息",
            type: "warning"
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scope>
.apply /deep/ .el-drawer__body {
  padding: 20px;
  flex-direction: column;
  display: flex;
  overflow-y: auto;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  /* background-color: yellow; */
  flex-grow: 2;
}

.drawer-footer {
  /* background-color: beige; */
  margin: 5px 0;
  display: flex;
}
</style>
