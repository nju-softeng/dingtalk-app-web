<template>
  <div class="app-container">
    <div class="box">
      <div class="action" style="margin-bottom:10px">
        <el-button type="primary" @click="dialog = true" icon="el-icon-plus"
          >创建评审记录</el-button
        >
      </div>
      <div v-for="(item, index) in list" :key="index">
        <div class="paper-item">
          <div class="content">
            <!-- <el-avatar shape="square" :size="50" :src="squareUrl"></el-avatar> -->

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
              <span>论文作者</span>
              <div style="margin-top:7px;padding:5px;width:200px">
                <span
                  style="padding:5px;"
                  v-for="o in item.paperDetails"
                  :key="o.index"
                  >{{ o.user.name }}</span
                >
              </div>
            </div>

            <div class="info-item">
              <span>评审结果</span>

              <div style="margin-top:7px">
                <el-link
                  v-if="item.vote == undefined"
                  type="primary"
                  @click="createVote(item)"
                >
                  <svg-icon icon-class="vote" /> 发起投票</el-link
                >

                <router-link
                  v-else-if="item.vote.status == false"
                  :to="'/paper/vote/' + item.id"
                  class="link-type"
                >
                  <el-link type="success">
                    <svg-icon icon-class="vote" /> 前往投票</el-link
                  >
                </router-link>

                <router-link
                  v-else-if="item.vote.status == true"
                  :to="'/paper/vote/' + item.id"
                  class="link-type"
                >
                  <el-tag v-if="item.vote.result == true">ACCEPT</el-tag>
                  <el-tag v-else>REJECT</el-tag>
                </router-link>
              </div>
            </div>

            <div class="info-item">
              <span>投稿结果</span>
              <div style="margin-top:7px">
                <el-tag v-if="item.result == 0">Wait</el-tag>
                <el-tag v-else-if="item.result == 0" type="success"
                  >Accept</el-tag
                >
                <el-tag v-else type="danger">Reject</el-tag>
                <span style="padding:5px;">{{ item.date }}</span>
              </div>
            </div>

            <div class="info-item">
              <span>操作</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top:5px;display:flex; justify-content:center">
      <el-pagination
        @prev-click="handlePrev"
        @next-click="handleNext"
        @current-change="handleCurrentChange"
        background
        :hide-on-single-page="total > 8"
        small
        layout="prev, pager, next"
        :total="total"
        :page-size="8"
      >
      </el-pagination>
    </div>

    <el-dialog title="发起投票" :visible.sync="voteDialog" width="40%">
      <span style="margin-right:10px">截止时间 </span>

      <el-time-select
        value-format="HH:mm:ss"
        v-model="voteform.endTime"
        :picker-options="{
          start: '09:00',
          step: '00:30',
          end: '21:30'
        }"
        placeholder="选择时间"
      >
      </el-time-select>

      <span slot="footer" class="dialog-footer">
        <el-button @click="voteDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitvote">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="dialog"
      top="10vh"
      @closed="closeDialog"
      width="60%"
      center
    >
      <div slot="title" class="header-title">
        <span class="title-age">内部论文评审记录 </span>
      </div>

      <div class="dialog-content">
        <div class="paper-form">
          <el-form
            ref="paperform"
            :rules="rules"
            :model="paperform"
            label-width="110px"
          >
            <el-form-item prop="title">
              <span slot="label">
                <svg-icon icon-class="paper" /> 论文名称</span
              >
              <el-input v-model="paperform.title"></el-input>
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="school" /> 投稿地点</span
              >
              <el-input v-model="paperform.journal"></el-input>
            </el-form-item>

            <el-form-item prop="level">
              <span slot="label">
                <svg-icon icon-class="grade" /> 论文分类</span
              >
              <el-select v-model="paperform.level" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              v-for="(author, index) in paperform.paperDetails"
              :prop="'paperDetails.' + index + '.user.id'"
              :key="index"
              :rules="{
                required: true,
                message: '请选择论文作者',
                trigger: 'change'
              }"
            >
              <span slot="label">
                <svg-icon icon-class="people" /> 论文作者 {{ index + 1 }}</span
              >

              <el-select
                v-model="author.user.id"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in userlist"
                  :key="item.index"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <el-tooltip
                class="item"
                effect="dark"
                content="支持搜索功能快速查找用户"
                placement="right"
              >
                <span style="margin-left:8px">
                  <svg-icon icon-class="hint"
                /></span>
              </el-tooltip>
            </el-form-item>
            <el-button
              type="text"
              @click="addAuthor"
              style="margin-left:20px;"
              icon="el-icon-plus"
              >添加作者</el-button
            >
            <el-button
              type="text"
              @click="rmAuthor"
              style="margin-left:20px;"
              icon="el-icon-minus"
              >减少作者</el-button
            >
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit('paperform')">确 定</el-button>
        <el-button @click="dialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getUserList } from "@/api/common";
import { addPaper, listPaper, createVote } from "@/api/paper";
export default {
  data() {
    return {
      userlist: [],
      total: 0,
      author: [],
      dialog: false,
      journalrank: [],
      state: "",
      paperform: {
        title: null,
        journal: null,
        level: null,
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
      voteDialog: false,
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
  },
  computed: {},
  methods: {
    handlePrev(val) {
      listPaper(val - 1).then(res => {
        this.list = res.data.content;
      });
    },
    handleNext(val) {
      listPaper(val - 1).then(res => {
        this.list = res.data.content;
      });
    },
    handleCurrentChange(val) {
      listPaper(val - 1).then(res => {
        this.list = res.data.content;
      });
    },

    submitvote() {
      if (this.voteform.endTime != null) {
        createVote(this.voteform).then(() => {
          this.voteDialog = false;
          this.$notify({
            title: "发起投票",
            message: "发起投票成功",
            type: "success"
          });
          this.$router.push({
            path: "/paper/vote/" + this.voteform.paperid
          });
        });
      }
    },
    createVote(item) {
      this.voteform.paperid = item.id;
      console.log(item);
      this.voteDialog = true;
      console.log("????");
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addPaper(this.paperform).then(() => {
            this.dialog = false;
            this.$notify({
              title: "成功",
              message: "论文记录创建成功",
              type: "success"
            });
            listPaper(0).then(res => {
              this.list = res.data.content;
            });
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
    closeDialog() {
      this.$refs.paperform.resetFields();
    },
    addAuthor() {
      let val = this.paperform.paperDetails.length + 1;
      this.paperform.paperDetails.push({
        num: val,
        user: {
          id: ""
        }
      });
    },
    rmAuthor() {
      if (this.paperform.paperDetails.length != 1) {
        this.paperform.paperDetails.pop();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.header-title {
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
  min-height: 750px;
  border-radius: 0;
}
.box {
  min-height: 60px;
  background: #fff;
  padding: 20px 20px 0 20px;
}

.paper-item {
  background: #fff;
  padding: 12px 12px 12px 0;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #f6f6f6;

  .content {
    display: flex;
    justify-content: space-around;

    .left-content {
      display: flex;
      flex-direction: column;
      .title {
        color: #1897ff;
        font-weight: 500;
        margin-bottom: 5px;
        width: 400px;
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .detail {
        color: gray;
        font-size: 13px;
        padding-top: 5px;
        .journal {
          width: 250px;
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
    width: 200px;
    padding: 0 20px;
  }
  .info-item {
    color: gray;
    display: flex;
    flex-direction: column;
    padding-left: 48px;
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
