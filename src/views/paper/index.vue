<template>
  <div class="app-container">
    <div style="height:83vh">
      <div class="box">
        <div class="action" style="margin-bottom:10px">
          <el-button type="primary" @click="dialog = true" icon="el-icon-plus">创建评审记录</el-button>
        </div>
        <div class="bar" style="border-width: 0 0 1px 0;border-style: solid;border-color: #f6f6f6;">
          <div style="width:380px;">论文信息</div>
          <div style="width:230px; padding-left:40px">论文作者</div>
          <div style="width:100px;">评审结果</div>
          <div style="width:180px;">投稿结果</div>
          <div style="width:100px;">操作</div>
        </div>
        <div v-for="(item, index) in list" :key="index">
          <div class="paper-item">
            <div class="content">
              <div class="left-content">
                <div class="title">
                  <router-link :to="'/paper/detail/' + item.id" class="link-type">
                    <el-link type="primary">
                      <svg-icon icon-class="paper" /> {{ item.title }}
                    </el-link>
                  </router-link>
                </div>
                <div style="display:flex" class="detail">
                  <div class="journal">
                    <svg-icon icon-class="school" /> {{ item.journal }}
                  </div>
                  <div class="time">
                    <svg-icon icon-class="date" />
                    {{ item.insertTime.substr(0, 10) }}
                  </div>
                </div>
              </div>

              <div class="info-item namelist">
                <span style="padding:5px;" v-for="o in item.paperDetails" :key="o.index">{{ o.user.name }}</span>
              </div>

              <div class="info-item" style="width:100px;">
                <div style="margin-top:7px">
                  <el-link v-if="item.vote == undefined" type="primary" @click="newVote(item)">
                    发起投票</el-link>

                  <router-link v-else-if="item.vote.status == false" :to="'/paper/vote/' + item.id" class="link-type">
                    <el-link type="success"> 前往投票</el-link>
                  </router-link>

                  <router-link v-else-if="item.vote.status == true" :to="'/paper/vote/' + item.id" class="link-type">
                    <el-tag type="success" v-if="item.vote.result == true">ACCEPT</el-tag>
                    <el-tag type="danger" v-else>REJECT</el-tag>
                  </router-link>
                </div>
              </div>

              <div class="info-item" style="width:120px;">
                <div style="margin-top:7px">
                  <el-tag v-if="item.vote == undefined || item.vote.status == false">待内部投票</el-tag>
                  <el-tag type="danger" v-else-if="item.vote.result == false">内审未通过</el-tag>
                  <el-tag v-else-if="item.result == undefined">等待最终结果</el-tag>
                  <el-tag v-else-if="item.result == true" type="success">ACCEPT</el-tag>
                  <el-tag v-else type="danger">REJECT</el-tag>
                  <span style="padding:5px;">{{ item.date }}</span>
                </div>
              </div>

              <div class="info-item" style="width:180px; padding-left:40px">
                <div style="font-size:14px">
                  <el-tooltip effect="dark" content="评审投票" placement="top">
                    <svg-icon @click="newVote(item)" icon-class="vote" />
                  </el-tooltip>

                  <el-divider direction="vertical"></el-divider>

                  <el-tooltip effect="dark" content="投稿结果" placement="top">
                    <svg-icon @click="updatePaperResult(item)" icon-class="review" />
                  </el-tooltip>

                  <el-divider direction="vertical"></el-divider>
                  <el-tooltip effect="dark" content="编辑" placement="top">
                    <svg-icon @click="modifyPaper(item)" icon-class="edit" />
                  </el-tooltip>

                  <el-divider direction="vertical"></el-divider>
                  <el-tooltip effect="dark" content="删除" placement="top">
                    <svg-icon @click="removePaper(item)" icon-class="remove" />
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top:5px;display:flex; justify-content:center">
      <el-pagination @prev-click="handlePrev" @next-click="handleNext" @current-change="handleCurrentChange" background :current-page.sync="currentPage" :hide-on-single-page="total > 6" small layout="prev, pager, next" :total="total" :page-size="6">
      </el-pagination>
    </div>

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

    <el-dialog :visible.sync="dialog" top="10vh" @closed="closeDialog" width="60%" center>
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
                  <svg-icon icon-class="school" /> 投稿地点</span>
                <el-input v-model="paperform.journal"></el-input>
              </el-form-item>

              <el-form-item prop="level">
                <span slot="label">
                  <svg-icon icon-class="grade" /> 论文分类</span>
                <el-select v-model="paperform.level" placeholder="请选择">
                  <el-option v-for="item in options" :key="item.index" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item v-for="(author, index) in paperform.paperDetails" :prop="'paperDetails.' + index + '.user.id'" :key="index" :rules="{
                  required: true,
                  message: '请选择论文作者',
                  trigger: 'change'
                }">
                <span slot="label">
                  <svg-icon icon-class="people" /> 论文作者
                  {{ index + 1 }}</span>

                <el-select v-model="author.user.id" filterable placeholder="请选择">
                  <el-option v-for="item in userlist" :key="item.index" :label="item.name" :value="item.id">
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
      paperform: {
        id: null,
        title: null,
        journal: null,
        level: null,
        currentPage: 0,
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
          value: 1,
          label: "Journal A"
        },
        {
          value: 2,
          label: "Conference A"
        },
        {
          value: 3,
          label: "Journal B"
        },
        {
          value: 4,
          label: "Conference B"
        },
        {
          value: 5,
          label: "Journal C"
        },
        {
          value: 6,
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
        level: [
          { required: true, message: "请选择论文分类", trigger: "change" }
        ]
      }
    };
  },
  created() {
    getUserList().then(res => {
      this.userlist = res.data;
      console.log(this.userlist);
    });
    listPaper(0).then(res => {
      this.list = res.data.content;
      this.total = res.data.total;
      console.log(res.data);
    });
    this.uid = sessionStorage.getItem("uid");
    this.role = sessionStorage.getItem("role");
    this.$message({
      showClose: true,
      message: "点击论文标题可以查看详细内容"
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
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.test {
  border-radius: 8px;
  width: 90%;
}
.el-form {
  width: 618px;
}
.paper-form {
  display: flex;
  // background-color: yellow;
}

.dialog-content {
  // background-color: aquamarine;
  display: flex;
  justify-content: center;
}

.paper-form >>> .el-input__inner {
  width: 220px;

  border-end-end-radius: 0;
  /*outline: medium;*/
}
.app-container {
  background-color: #f5f5f5;
  height: 92.8vh;
  border-radius: 0;
}
.box {
  min-height: 60px;
  background: #fff;
  padding: 20px 20px 0 20px;
}

.bar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 28px;
  color: gray;
  font-size: 13px;
}

.paper-item {
  background: #fff;
  padding: 12px 12px 12px 0;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #f6f6f6;

  .content {
    display: flex;
    justify-content: space-between;

    .left-content {
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      .title {
        color: #1897ff;
        font-weight: 500;
        margin-bottom: 5px;
        width: 380px;
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .detail {
        color: gray;
        font-size: 13px;
        padding-top: 7px;
        .journal {
          width: 200px;
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .time {
          padding-left: 5px;
        }
      }
    }
  }
  .namelist {
    width: 240px;
    padding: 0 20px;
    justify-content: flex-start;
  }
  .info-item {
    color: gray;
    display: flex;
    justify-content: flex-start;
    // padding-left: 15px;
    font-size: 13px;
    align-items: center;
  }
}
.content {
  height: 50px;
  display: flex;
  justify-content: flex-start;
}
</style>
