<template>
  <div class="app-container">
    <div class="paper-box">
      <div class="action" style="">
        <!--导航栏-->
        <tabs v-model="activeTab">
          <tab-pane label="组内评审" name="paperInternal"></tab-pane>
          <tab-pane label="组外评审" name="paperExternal"></tab-pane>
        </tabs>
        <!--添加按钮-->
        <div style=" display:flex; justify-content: center; align-items: center; ">
          <el-button type="primary" @click="addReviewDialog = true" icon="el-icon-plus">添加论文</el-button>
        </div>
      </div>
      <component ref="reviewTab" v-bind:is="activeTab"></component>
    </div>

    <!-- 添加评审记录  dialog -->
    <el-dialog :visible.sync="addReviewDialog" top="16vh" :lock-scroll="false" :width="addReviewWidth" @closed="closeAddReviewDialog"  center>
      <!-- dialog 标题 -->
      <div slot="title" class="header-title">
        <span class="title-age"> {{addReviewDialogTitle}} </span>
      </div>
      <!-- 评审类型选择菜单 -->
      <div v-if="addReviewContent == undefined" class="dialog-content">
        <el-card shadow="hover" class="card" @click.native="addReviewContent='internalReview'">
          <div>内部评审</div>
        </el-card>
        <el-card shadow="hover" class="card" @click.native="addReviewContent='externalReview'">
          <div>外部评审</div>
        </el-card>
      </div>
      <!-- 添加内部评审 -->
      <div v-if="addReviewContent == 'internalReview'" v-loading="loading">
        <div class="dialog-content">
          <div class="paper-form">
            <el-form ref="paperform" :rules="rules" :model="paperform" label-width="110px">
              <el-form-item prop="title">
                <span slot="label">
                  <svg-icon icon-class="paper" /> 论文名称</span>
                <el-input v-model="paperform.title"></el-input>
              </el-form-item>
              <el-form-item>
                <span slot="label">
                  <svg-icon icon-class="school" /> 刊物/会议</span>
                <el-input v-model="paperform.journal"></el-input>
              </el-form-item>

              <el-form-item prop="paperType">
                <span slot="label">
                  <svg-icon icon-class="grade" /> 论文分类</span>
                <el-select style="width:193px" v-model="paperform.paperType" placeholder="请选择">
                  <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <span slot="label">
                  <svg-icon icon-class="school" /> 通知时间</span>
                <el-date-picker style="width:193px" v-model="paperform.issueDate" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>

              <el-form-item v-for="(author, index) in paperform.authors" :prop="'authors.' + index + '.uid'"
                :key="index" :rules="{
                  required: true,
                  message: '请选择学生作者',
                  trigger: 'change'
                }">
                <span slot="label">
                  <svg-icon icon-class="people" /> 学生作者
                  {{ index + 1 }}</span>

                <el-select style="width:193px" v-model="author.uid" filterable placeholder="请选择">
                  <el-option v-for="(item, index) in userlist" :key="index" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
                <el-tooltip class="item" effect="dark" content="支持搜索功能快速查找用户" placement="right">
                  <span style="margin-left:8px">
                    <svg-icon icon-class="hint" /></span>
                </el-tooltip>
              </el-form-item>
              <el-button type="text" @click="addAuthor" style="margin-left:20px;" icon="el-icon-plus">添加作者</el-button>
              <el-button type="text" @click="rmAuthor" style="margin-left:20px;" icon="el-icon-minus">减少作者</el-button>
            </el-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submit('paperform')">确 定</el-button>
          <el-button @click="addReviewDialog = false">取 消</el-button>
        </span>
      </div>
      <!-- 添加外部评审 -->
      <div v-if="addReviewContent == 'externalReview'">
        <div class="dialog-content">
          <div class="paper-form">
            <el-form ref="paperform" :rules="rules" :model="paperform" label-width="110px">
              <el-form-item prop="title">
                <span slot="label">
                  <svg-icon icon-class="paper" /> 论文名称</span>
                <el-input v-model="paperform.title"></el-input>
              </el-form-item>




              <el-form-item>
                <span slot="label">
                  <svg-icon icon-class="school" /> 通知时间</span>
                <el-date-picker style="width:193px" v-model="paperform.issueDate" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>


            </el-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submit('paperform')">确 定</el-button>
          <el-button @click="addReviewDialog = false">取 消</el-button>
        </span>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { getUserList } from "@/api/common";
import Tabs from "@/components/TabNav/tabs"
import TabPane from "@/components/TabNav/tabpane"
import paperExternal from "@/views/paper/paperExternal";
import paperInternal from "@/views/paper/paperInternal";


import {
  addPaper,
  listPaper,
  createVote,
  submitResult,
  rmPaper
} from "@/api/paper";

const levels = [
  {
    value: "JOURNAL_A",
    label: "Journal A"
  },
  {
    value: "CONFERENCE_A",
    label: "Conference A"
  },
  {
    value: "JOURNAL_B",
    label: "Journal B"
  },
  {
    value: "CONFERENCE_B",
    label: "Conference B"
  },
  {
    value: "JOURNAL_C",
    label: "Journal C"
  },
  {
    value: "CONFERENCE_C",
    label: "Conference C"
  }
];

export default {
  data() {
    return {
      // 当前激活的选项卡，默认是 paperInternal
      activeTab:"paperInternal",
      // 用户列表
      userlist: [],
      //
      addReviewDialog: false,
      addReviewWidth: '40%',
      addReviewContent: undefined,
      addReviewDialogTitle: "请选择评审类型",

      loading: false,
      options: levels,
      paperform: {
        id: null,
        title: null,
        journal: null,
        paperType: null,
        issueDate: null,
        authors: [
          {
            num: 1,
            name: "",
            uid: null
          }
        ]
      },

      rules: {
        title: [{ required: true, message: "请输入论文名称", trigger: "blur" }],
        paperType: [
          { required: true, message: "请选择论文分类", trigger: "change" }
        ]
      },

      test : '30%'



      // uid: "",
      // role: "",
      // resultForm: {
      //   paperid: "",
      //   result: ""
      // },

    };
  },
  watch: {
    addReviewContent(val) {
      if (val == 'internalReview') {
        this.addReviewDialogTitle = '内部评审'
        this.addReviewWidth = '60%'
      } else if (val == 'externalReview') {
        this.addReviewDialogTitle = '外部评审'
        this.addReviewWidth = '60%'
      } else {
        this.addReviewDialogTitle = '请选择评审类型'
        this.addReviewWidth = '40%'
      }
    }
  },
  components:{
    Tabs,
    TabPane,
    paperExternal,
    paperInternal
  },
  created() {
    getUserList().then(res => {
      this.userlist = res.data;
    });

    this.uid = sessionStorage.getItem("uid");
    this.role = sessionStorage.getItem("role");

  },
  methods: {
    // 提交论文评审记录
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          addPaper(this.paperform)
            .then(() => {
              this.addReviewDialog = false;
              this.loading = false;
              this.$refs.reviewTab.fetchPaper(1);
              this.$refs.reviewTab.currentPage = 1;

              this.$notify({
                title: "成功",
                message: "论文记录提交成功",
                type: "success"
              });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.$notify({
            title: "提交失败",
            message: "请填写必要信息",
            type: "warning"
          });
        }
      });
    },
    // 关闭前清空表单
    closeAddReviewDialog() {
      this.addReviewContent = undefined;
      this.$refs.paperform.resetFields();
      this.paperform = {
        id: null,
        title: null,
        journal: null,
        paperType: null,
        issueDate: null,
        authors: [
          {
            num: 1,
            name: "",
            uid: null
          }
        ]
      }
    },
    // 添加论文作者
    addAuthor() {
      let val = this.paperform.authors.length + 1;
      this.paperform.authors.push({
        num: val,
        uid: ""
      });
    },
    // 移除论文作者
    rmAuthor() {
      if (this.paperform.authors.length != 1) {
        this.paperform.authors.pop();
      }
    },

  }
};
</script>

<style lang="scss" scoped>

.action {
  margin-bottom:5px;
  margin-right: 8px;
  display: flex;
  justify-content: space-between;
  align-content: center
}


.card {
  width: 25vh;
  height: 25vh;
  margin:10px;
  text-align:center;
  display:flex;
  justify-content: center;
  align-items: center;
}


.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-form {
  width: 618px;
}
.paper-form {
  display: flex;
}

.dialog-content {
  display: flex;
  justify-content: center;
}

.app-container {
  background-color: #f5f5f5;
  min-height: 95vh;
}

.paper-box {
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
}

</style>
