<template>
  <div class="app-container">
    <div class="box">
      <div class="list">
        <div class="action" style="margin-bottom:10px">
          <el-button type="primary" @click="dialog = true" icon="el-icon-plus">添加论文</el-button>
        </div>
        <el-table :data="list" class="tableClass">
          <el-table-column label="论文信息" width="335">
            <template slot-scope="scope">
              <div class="paper-item">
                <div class="left-content">
                  <div class="title">
                    <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top-start">
                      <router-link :to="'/paper/detail/' + scope.row.id" class="link-type">
                        <svg-icon icon-class="paper" /> {{ scope.row.title }}
                      </router-link>
                    </el-tooltip>
                  </div>
                  <div class="detail">
                    <div class="journal">
                      <svg-icon icon-class="school" /> {{ scope.row.journal }}
                    </div>
                    <el-tooltip class="item" effect="dark" content="会议/出刊时间" placement="top-start">
                      <div class="time">
                        <svg-icon icon-class="date" />
                        {{ scope.row.issueDate }}
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="论文作者" align="center">
            <template slot-scope="scope">
              <div class="info-item">
                <el-tooltip :disabled="scope.row.paperDetails.length <= 3" class="item" effect="dark" placement="top-start">
                  <div slot="content">
                    <span style="padding:5px;" v-for="(o, index) in scope.row.paperDetails" :key="index">{{ o.user.name }}</span>
                  </div>
                  <div class="namelist">
                    <span style="padding:5px;" v-for="(o, index) in scope.row.paperDetails" :key="index">{{ o.user.name }}</span>
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="投票结果" align="center" width="100">
            <template slot-scope="scope">
              <div class="info-item">
                <el-link v-if="scope.row.vote == undefined" type="primary" @click="newVote(scope.row)">
                  发起投票</el-link>

                <router-link v-else-if="scope.row.vote.status == false" :to="'/paper/vote/' + scope.row.id" class="link-type">
                  <el-link type="success"> 前往投票</el-link>
                </router-link>
                <router-link v-else-if="scope.row.vote.status == true" :to="'/paper/vote/' + scope.row.id" class="link-type">
                  <el-tag class="paper-tag" type="success" v-if="scope.row.vote.result == true">ACCEPT</el-tag>
                  <el-tag class="paper-tag" type="danger" v-else>REJECT</el-tag>
                </router-link>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="投稿结果" align="center" width="100">
            <template slot-scope="scope">
              <div class="info-item">
                <el-tag class="paper-tag" v-if="
                    scope.row.vote == undefined ||
                      scope.row.vote.status == false
                  ">待内部投票</el-tag>
                <el-tag class="paper-tag" type="danger" v-else-if="scope.row.vote.result == false">未提交</el-tag>
                <el-tag class="paper-tag" type="info" v-else-if="scope.row.result == undefined">审稿中</el-tag>
                <el-tag class="paper-tag" v-else-if="scope.row.result == true" type="success">ACCEPT</el-tag>
                <el-tag class="paper-tag" v-else type="danger">REJECT</el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" fixed="right" width="180">
            <template slot-scope="scope">
              <div class="info-item">
                <div style="font-size:14px">
                  <el-tooltip effect="dark" content="评审投票" placement="top">
                    <svg-icon @click="newVote(scope.row)" icon-class="vote" />
                  </el-tooltip>

                  <el-divider direction="vertical"></el-divider>

                  <el-tooltip effect="dark" content="投稿结果" placement="top">
                    <svg-icon @click="updatePaperResult(scope.row)" icon-class="review" />
                  </el-tooltip>

                  <el-divider direction="vertical"></el-divider>
                  <el-tooltip effect="dark" content="编辑" placement="top">
                    <svg-icon @click="modifyPaper(scope.row)" icon-class="edit" />
                  </el-tooltip>

                  <el-divider direction="vertical"></el-divider>
                  <el-tooltip effect="dark" content="删除" placement="top">
                    <svg-icon @click="removePaper(scope.row)" icon-class="remove" />
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
          <template slot="empty">
            <div style="height:200px;">
              <div style="margin-top:100px;">
                <svg-icon icon-class="null" style="font-size:32px" /> <br />
              </div>
              <div style="line-height: 10px;">
                <span>没有论文记录</span>
              </div>
            </div>
          </template>
        </el-table>
      </div>
      <div style="margin-top:5px;display:flex; justify-content:center">
        <el-pagination @prev-click="handlePrev" @next-click="handleNext" @current-change="handleCurrentChange" background :current-page.sync="currentPage" :hide-on-single-page="total < 6 ? true : false" small layout="prev, pager, next" :total="total" :page-size="6">
        </el-pagination>
      </div>
    </div>

    <!-- 投稿结果  dialog -->
    <el-dialog title="投稿结果" width="30%" :visible.sync="resultDialog">
      <div v-loading="loading">
        <el-form>
          <el-form-item>
            <span slot="label">
              <svg-icon icon-class="paper" /> 接收情况:
            </span>
            <el-radio-group v-model="resultForm.result">
              <el-radio :label="true">接收</el-radio>
              <el-radio :label="false">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="resultDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitPaperResult()">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 发起投票  dialog -->
    <el-dialog title="发起投票" :visible.sync="voteDialog" width="40%">
      <div v-loading="loading">
        <el-form ref="voteform" :model="voteform">
          <el-form-item prop="endTime" :rules="{
              required: true,
              message: '请选择截止时间',
              trigger: 'change'
            }">
            <span slot="label">截止时间 </span>
            <el-time-picker arrow-control v-model="voteform.endTime" value-format="HH:mm:ss" :picker-options="{
                selectableRange: '08:30:00 - 21:30:00'
              }" placeholder="选择时间">
            </el-time-picker>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="voteDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitvote">确 定</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 添加评审记录  dialog -->
    <el-dialog :visible.sync="dialog" top="10vh" @closed="closeDialog" width="75%" center>
      <div slot="title" class="header-title">
        <span class="title-age">内部论文评审记录 </span>
      </div>

      <div v-loading="loading">
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

              <el-form-item prop="level">
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

              <el-form-item v-for="(author, index) in paperform.paperDetails" :prop="'paperDetails.' + index + '.user.id'" :key="index" :rules="{
                  required: true,
                  message: '请选择论文作者',
                  trigger: 'change'
                }">
                <span slot="label">
                  <svg-icon icon-class="people" /> 论文作者
                  {{ index + 1 }}</span>

                <el-select style="width:193px" v-model="author.user.id" filterable placeholder="请选择">
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
import {
  addPaper,
  listPaper,
  createVote,
  submitResult,
  rmPaper
} from "@/api/paper";
export default {
  data() {
    return {
      userlist: [],
      total: 0,
      author: [],
      resultDialog: false,
      dialog: false,
      journalrank: [],
      state: "",
      currentPage: 0,
      paperform: {
        id: null,
        title: null,
        journal: null,
        paperType: null,
        issueDate: null,
        paperDetails: [
          {
            num: 1,
            user: {
              id: ""
            }
          }
        ]
      },
      voteform: {
        paperid: "",
        endTime: ""
      },
      options: [
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
      ],
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
  created() {
    getUserList().then(res => {
      this.userlist = res.data;
    });
    listPaper(0).then(res => {
      this.list = res.data.content;
      this.total = res.data.total;
    });
    this.uid = sessionStorage.getItem("uid");
    this.role = sessionStorage.getItem("role");

    this.$notify({
      title: "小提示",
      message: "点击论文标题可以查看详情",
      position: "bottom-right"
    });
  },
  computed: {
    getPermission() {
      return (val, uid) => {
        if (this.role == "admin" || this.role == "auditor") return false;
        if (val.map(item => item.user.id).indexOf(eval(uid)) != -1) {
          return false;
        } else {
          return true;
        }
      };
    }
  },
  methods: {
    // 分页前一页
    handlePrev(val) {
      listPaper(val - 1).then(res => {
        this.list = res.data.content;
      });
    },
    // 分页下一页
    handleNext(val) {
      listPaper(val - 1).then(res => {
        this.list = res.data.content;
      });
    },
    // 分页当前页
    handleCurrentChange(val) {
      listPaper(val - 1).then(res => {
        this.list = res.data.content;
      });
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
                title: "发起投票",
                message: "发起投票成功",
                type: "success"
              });
              this.$router.push({
                path: "/paper/vote/" + this.voteform.paperid
              });
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
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
    // 提交论文评审记录
    submit(formName) {
      let page = 0;
      if (this.paperform.id != undefined) {
        page = this.currentPage - 1;
      }
      this.loading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          addPaper(this.paperform)
            .then(() => {
              this.dialog = false;
              this.loading = false;
              this.$notify({
                title: "成功",
                message: "论文记录提交成功",
                type: "success"
              });
              listPaper(page).then(res => {
                console.log(res.data.content);
                this.list = res.data.content;
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
    closeDialog() {
      this.$refs.paperform.resetFields();
      this.paperform.id = null;
      this.paperform.journal = "";
      this.paperform.title = "";
      this.paperform.issueDate = "";
      this.paperform.level = "";
      this.paperform.paperDetails = [
        {
          num: 1,
          user: {
            id: ""
          }
        }
      ];
    },
    // 添加论文作者
    addAuthor() {
      let val = this.paperform.paperDetails.length + 1;
      this.paperform.paperDetails.push({
        num: val,
        user: {
          id: ""
        }
      });
    },
    // 移除论文作者
    rmAuthor() {
      if (this.paperform.paperDetails.length != 1) {
        this.paperform.paperDetails.pop();
      }
    },
    // 更新论文投稿结果
    updatePaperResult(item) {
      this.resultForm.paperid = item.id;
      let val = item.paperDetails;
      if (
        this.role == "admin" ||
        this.role == "auditor" ||
        val.map(item => item.user.id).indexOf(eval(this.uid)) != -1
      ) {
        this.resultDialog = true;
      } else {
        this.$message({
          message: "只有审核人，和论文作者才可以操作",
          type: "warning"
        });
      }
    },

    submitPaperResult() {
      if (this.resultForm.result != undefined) {
        this.loading = true;
        submitResult(this.resultForm.paperid, this.resultForm.result)
          .then(res => {
            console.log(res.data);
            this.resultDialog = false;
            listPaper(this.currentPage - 1).then(res => {
              this.list = res.data.content;
              this.total = res.data.total;
              console.log(this.list);
            });
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
      let val = item.paperDetails;
      if (
        this.role == "admin" ||
        this.role == "auditor" ||
        val.map(item => item.user.id).indexOf(eval(this.uid)) != -1
      ) {
        this.dialog = true;
        this.paperform.id = item.id;
        this.paperform.title = item.title;
        this.paperform.journal = item.journal;
        this.paperform.level = item.level;
        this.paperform.issueDate = item.issueDate;
        this.paperform.paperDetails = item.paperDetails;
      } else {
        this.$message({
          message: "只有审核人，和论文作者才可以操作",
          type: "warning"
        });
      }
    },
    // 删除论文记录
    removePaper(item) {
      let val = item.paperDetails;
      if (
        this.role == "admin" ||
        this.role == "auditor" ||
        val.map(item => item.user.id).indexOf(eval(this.uid)) != -1
      ) {
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
              listPaper(0).then(res => {
                this.list = res.data.content;
                this.total = res.data.total;
              });
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
}

.box {
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
  min-height: 90vh;
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
        color: #409eff;
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
