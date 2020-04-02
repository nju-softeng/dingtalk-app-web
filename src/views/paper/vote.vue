<template>
  <div class="app-container">
    <div class="content">
      <el-page-header @back="goBack"> </el-page-header>
      <div class="box">
        <div class="test">
          <el-form>
            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="paper" /> 论文名称</span>
              {{ paper.title }}
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="grade" /> 论文分类</span>
              {{ getlevel(paper.level) }}
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="people" /> 论文作者
              </span>
              <span style="margin:10px" v-for="(p, index) in paper.paperDetails" :key="index">{{ p.user.name }}</span>
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="date" /> 投票截止</span>
              {{ getddl(startTime, endtime) }}
              <span v-if="isEnd"> [已结束]</span>
              <el-tooltip class="item" effect="dark" content="截止时间后投票无效" placement="right">
                <span style="margin-left:8px">
                  <svg-icon icon-class="hint" /></span>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </div>
        <div class="chart" v-loading="loading">
          <div v-if="!showAns" style="width:50%">
            <el-popconfirm title="确定要接收吗？" @onConfirm="addpoll(true)">
              <el-button slot="reference" type="primary">Accept</el-button>
            </el-popconfirm>

            <el-popconfirm @onConfirm="addpoll(false)" style="margin-left:50px" icon="el-icon-info" iconColor="red" title="确定要拒绝吗？">
              <el-button slot="reference" type="danger">Reject</el-button>
            </el-popconfirm>
          </div>
          <div v-if="showAns">
            <el-form>
              <el-form-item>
                <span slot="label">
                  <svg-icon icon-class="paper" /> Accept {{ accept }} 票</span>
                <span> {{ getNum(accept, total) }}% </span>
                <span v-if="myresult == true" style="color:#409EFF; font-weight:500">[已选]</span>
                <el-progress class="progress" :percentage="getpercentage(accept, total)" status="success"></el-progress>
              </el-form-item>
              <el-form-item>
                <span slot="label">
                  <svg-icon icon-class="paper" /> Reject {{ reject }} 票</span>
                {{ getNum(reject, total) }}%
                <span v-if="myresult == false" style="color:#409EFF; font-weight:500">[已选]</span>
                <el-progress class="progress" :percentage="getpercentage(reject, total)" status="exception"></el-progress>
              </el-form-item>
              <el-form-item>
                <span slot="label">
                  <svg-icon icon-class="paper" /> 参与人数 {{ total }} 人</span>
                <span v-if="myresult == undefined" style="color:#409EFF; font-weight:500;margin-right:5px">[您未参与投票]
                </span>
                <el-link type="primary" :underline="false" @click="dialog = true">详情
                </el-link>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <el-dialog title="投票详情" :visible.sync="dialog" width="55%">
          <el-form>
            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="paper" /> 接收{{ accept }}票:
              </span>

              <el-tag style="margin:0px 4px;" v-for="(item, index) in acceptlist" :key="index">{{ item }}</el-tag>
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="paper" /> 拒绝{{ reject }}票:
              </span>

              <el-tag style="margin:0px 4px;" v-for="(item, index) in rejectlist" :key="index">{{ item }}</el-tag>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialog = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { getPaper, getVoteDetail, addpoll } from "@/api/paper";

export default {
  data() {
    return {
      loading: false,
      level: [
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
      pid: null,
      vid: "",
      showAns: false,
      dialog: false,
      accept: "",
      reject: "",
      isEnd: "false",
      startTime: "",
      endtime: "",
      acceptlist: [],
      rejectlist: [],
      total: "",
      paper: {},
      myresult: undefined,
      pollform: {
        result: "",
        vote: {
          id: ""
        }
      }
    };
  },
  computed: {
    getlevel() {
      return val => this.level.find(item => item.value == val).label;
    },
    getpercentage() {
      return (val, total) => {
        if (total == 0) {
          return 0;
        }
        return (val / total) * 100;
      };
    },
    getNum() {
      return (val, total) => {
        if (total == 0) {
          return 0;
        }
        return (val / total).toFixed(2) * 100;
      };
    },
    getddl() {
      return (st, et) => {
        return st + " " + et.slice(0, 5);
      };
    }
  },
  created() {
    this.pid = this.$route.params.id;
    getPaper(this.pid).then(res => {
      console.log(res.data);
      this.paper = res.data;
      this.vid = res.data.vote.id;
      this.endtime = res.data.vote.endTime;
      this.startTime = res.data.vote.startTime;
      this.isEnd = res.data.vote.status;
    });
    getVoteDetail(this.pid).then(res => {
      console.log(res);
      this.showAns = res.data.status;
      if (this.showAns) {
        this.accept = res.data.accept;
        this.reject = res.data.reject;
        this.total = res.data.total;
        this.myresult = res.data.result;
        this.acceptlist = res.data.acceptnames;
        this.rejectlist = res.data.rejectnames;
      }
    });
    this.initWebSocket();
  },
  destroyed() {
    // 离开页面时关闭websocket连接
    this.ws.close();
  },
  methods: {
    // 初始化websocket
    initWebSocket() {
      let that = this;
      if (window.WebSocket) {
        //var server_host = window.location.hostname;//localhost:8080/
        var url = "ws://localhost:8080/websocket";
        let ws = new WebSocket(url);
        that.ws = ws;
        ws.onopen = function() {
          console.log("服务器连接成功: " + url);
        };
        ws.onclose = function() {
          console.log("服务器连接关闭: " + url);
        };
        ws.onerror = function() {
          console.log("服务器连接出错: " + url);
        };
        ws.onmessage = function(e) {
          //接收服务器返回的数据
          console.log(e.data);
          let data = JSON.parse(e.data);
          that.total = data.total;
          that.accept = data.accept;
          that.reject = data.reject;
          that.myresult = data.result;
          that.acceptlist = data.acceptnames;
          that.rejectlist = data.rejectnames;
        };
      }
    },
    addpoll(result) {
      this.pollform.result = result;
      this.pollform.vote.id = this.vid;
      this.loading = true;
      addpoll(this.vid, this.pollform)
        .then(res => {
          this.showAns = true;
          this.accept = res.data.accept;
          this.reject = res.data.reject;
          this.total = res.data.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    createVote() {
      console.log("????");
      this.dialog = false;
    },
    goBack() {
      this.$router.push({ path: "/paper/index" });
    }
  }
};
</script>
<style lang="scss" scoped>
.progress {
  width: 80%;
}
.box {
  margin-top: 20px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.test {
  width: 50%;
  border: 1px;
  // border-style: solid;
}
.chart {
  width: 50%;
  border: 1px;
  // border-style: solid;
}

.app-container {
  min-height: 95vh;
}

.content {
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
  min-height: 86vh;
  background: #fff;
  padding: 15px;
}
</style>
