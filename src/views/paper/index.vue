<template>
  <div class="app-container">
    <div class="paper-box">
      <div class="action" style="margin-bottom:10px; display: flex; justify-content: space-between; align-content: center">

        <tabs v-model="activetab">
          <tab-pane label="组内评审" name="paperInternal"></tab-pane>
          <tab-pane label="组外评审" name="paperExternal"></tab-pane>
        </tabs>

        <div style=" display:flex; justify-content: center; align-items: center; ">
          <el-button type="primary" @click="dialog = true" icon="el-icon-plus">添加论文</el-button>
        </div>
      </div>
      <component v-bind:is="activetab"></component>
    </div>

    <!-- 添加评审记录  dialog -->
    <el-dialog :visible.sync="dialog" top="10vh" :lock-scroll="false" @closed="closeDialog"  center>
      <div slot="title" class="header-title">
        <span class="title-age"> 添加评审记录 </span>
      </div>
      <div v-if="true" class="dialog-content">
        <el-card shadow="hover" style="width: 25vh; height: 25vh;  margin:10px; text-align:center;">
          组内评审
        </el-card>
        <el-card shadow="hover" style="width: 25vh; height: 25vh;  margin:10px; text-align:center; ">
          组外评审
        </el-card>
      </div>
      <div v-if="false" v-loading="loading">
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
          <el-button @click="dialog = false">取 消</el-button>
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
      activetab:"paperInternal",
      test: 0,
      userlist: [],
      total: 0,
      resultDialog: false,
      dialog: false,
      state: "",
      currentPage: 1,
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
      voteform: {
        paperid: "",
        endTime: ""
      },
      options: levels,
      list: [],
      loading: false,
      voteDialog: false,
      uid: "",
      role: "",
      resultForm: {
        paperid: "",
        result: ""
      },
      rules: {
        title: [{ required: true, message: "请输入论文名称", trigger: "blur" }],
        paperType: [
          { required: true, message: "请选择论文分类", trigger: "change" }
        ]
      }
    };
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

    this.fetchPaper(1);
    this.uid = sessionStorage.getItem("uid");
    this.role = sessionStorage.getItem("role");

    this.$message({
      showClose: true,
      duration: 1000,
      message: "点击论文标题可以查看详情"
    });
  },
  methods: {
    // 分页获取论文信息
    fetchPaper(page) {
      return new Promise((resolve, reject) => {
        listPaper(page, 6)
          .then(res => {
            this.list = res.data.list;
            this.total = res.data.total;
            console.log(res.data);
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 分页前一页
    handlePrev(val) {
      this.fetchPaper(val);
    },
    // 分页下一页
    handleNext(val) {
      this.fetchPaper(val);
    },
    // 分页当前页
    handleCurrentChange(val) {
      this.fetchPaper(val);
    },
    // 创建投票，唤起dialog
    newVote(item) {
      this.voteform.paperid = item.id;
      if (item.vote == undefined) {
        console.log(item);
        this.voteDialog = true;
      } else {
        this.$router.push({
          path: "/paper/vote/" + item.id
        });
      }
    },
    // 提交新创建的投票
    submitvote() {
      this.$refs.voteform.validate(valid => {
        if (valid) {
          this.loading = true;
          createVote(this.voteform)
            .then(() => {
              this.voteDialog = false;
              this.$notify({
                message: "发起投票成功",
                type: "success"
              });
              this.$router.push({
                path: "/paper/detail/" + this.voteform.paperid + "/vote"
              });
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    // 提交论文评审记录
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          addPaper(this.paperform)
            .then(() => {
              this.dialog = false;
              this.loading = false;
              this.$notify({
                title: "成功",
                message: "论文记录提交成功",
                type: "success"
              });
              this.fetchPaper(1);
              this.currentPage = 1;
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
    closeDialog() {
      this.$refs.paperform.resetFields();
      this.paperform.id = null;
      this.paperform.journal = "";
      this.paperform.title = "";
      this.paperform.issueDate = "";
      this.paperform.paperType = "";
      this.paperform.authors = [
        {
          num: 1,
          uid: ""
        }
      ];
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
    // 判断用户是否有修改论文记录的权限
    hasAuth(authors) {
      if (
        this.role == "admin" ||
        this.role == "auditor" ||
        authors.map(item => item.uid).indexOf(eval(this.uid)) != -1
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 更新论文投稿结果, 唤醒dialog
    updatePaperResult(item) {
      this.resultForm.paperid = item.id;
      if (this.hasAuth(item.authors)) {
        this.resultDialog = true;
      } else {
        this.$message({
          message: "只有审核人，和论文作者才可以操作",
          type: "warning"
        });
      }
    },
    // 提交论文投稿结果
    submitPaperResult() {
      if (this.resultForm.result != undefined) {
        this.loading = true;
        submitResult(this.resultForm.paperid, this.resultForm.result)
          .then(res => {
            console.log(res.data);
            this.resultDialog = false;
            this.fetchPaper(this.currentPage);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.$message({
          message: "请选择结果",
          type: "warning"
        });
      }
    },
    // 修改论文记录
    modifyPaper(item) {
      if (this.hasAuth(item.authors)) {
        this.dialog = true;
        this.paperform.id = item.id;
        this.paperform.title = item.title;
        this.paperform.journal = item.journal;
        this.paperform.paperType = item.paperType;
        this.paperform.issueDate = item.issueDate;
        this.paperform.authors = item.authors;
      } else {
        this.$message({
          message: "只有审核人，和论文作者才可以操作",
          type: "warning"
        });
      }
    },
    // 删除论文记录
    // todo 修改，太罗嗦了
    removePaper(item) {
      if (this.hasAuth(item.authors)) {
        this.$confirm(
          "删除后，对应的AC变化和投票记录也将被删除，请谨慎操作",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            rmPaper(item.id).then(() => {
              this.fetchPaper(this.currentPage);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message({
          message: "只有审核人，和论文作者才可以操作",
          type: "warning"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tableClass {
  /deep/ .el-table__fixed-right {
    height: calc(100% - 11px) !important; //设置高优先，以覆盖内联样式
  }
  /deep/ .el-table__fixed-right::before {
    height: 0px !important; //设置高优先，以覆盖内联样式
  }
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

.list {
  min-height: 60px;
  background: #fff;
  padding: 20px 20px 0 20px;
}

.paper-item {
  padding: 3px 12px 3px 0;
  border-width: 0 0 1px 0;

  .left-content {
    font-size: 13px;
    display: flex;
    flex-direction: column;
    .title {
      a {
        color: #0366d6;
      }
      color: #409eff;
      font-weight: 500;
      margin-bottom: 5px;
      width: 330px;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .detail {
      display: flex;
      color: gray;
      font-size: 13px;
      padding-top: 7px;
      .journal {
        width: 180px;
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .time {
        padding-left: 5px;
      }
    }
  }

  .info-item {
    color: gray;
    display: flex;
    justify-content: flex-start;
    font-size: 13px;
    align-items: center;
  }
}

.namelist {
  min-width: 100px;
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap;
  text-overflow: ellipsis;
}

.content {
  height: 50px;
  display: flex;
  justify-content: flex-start;
}

.paper-tag {
  width: 72px;
  text-align: center;
}
</style>
