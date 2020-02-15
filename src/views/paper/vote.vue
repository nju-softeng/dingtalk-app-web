<template>
  <div class="app-container">
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
              <svg-icon icon-class="school" /> 投稿地点</span>
            {{ paper.journal }}
          </el-form-item>
          <el-form-item>
            <span slot="label">
              <svg-icon icon-class="grade" /> 论文分类</span>
            {{ getlevel(paper.level).label }}
          </el-form-item>
          <el-form-item>
            <span slot="label">
              <svg-icon icon-class="people" /> 论文作者
            </span>
            <span style="margin:10px" v-for="p in paper.paperDetails" :key="p.index">{{ p.user.name }}</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="chart">
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
                <svg-icon icon-class="paper" /> Accept {{ accept }} 人</span>
              <el-progress class="progress" :percentage="(accept / total) * 100" status="success"></el-progress>
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="paper" /> Reject {{ reject }}人</span>
              <el-progress class="progress" :percentage="(reject / total) * 100" status="exception"></el-progress>
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="paper" /> 投票人数 {{ total }} 人</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    {{ accept }}
    {{ reject }}
    {{ total }}
    {{ wsData }}
    <!-- {{ paper }} -->
  </div>
</template>
<script>
import { getPaper, getVoteDetail, addpoll } from "@/api/paper";

export default {
  data() {
    return {
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
      total: "",
      paper: {},
      pollform: {
        result: "",
        vote: {
          id: ""
        }
      },
      wsData: {
        accept: "",
        reject: "",
        total: ""
      }
    };
  },
  computed: {
    getlevel() {
      return val => this.level.find(item => item.value == val);
    }
  },
  created() {
    this.pid = this.$route.params.id;
    getPaper(this.pid).then(res => {
      this.paper = res.data;
      this.vid = res.data.vote.id;
    });
    getVoteDetail(this.pid).then(res => {
      console.log(res);
      this.showAns = res.data.status;
      if (this.showAns) {
        this.accept = res.data.accept;
        this.reject = res.data.reject;
        this.total = res.data.total;
      }
    });
    this.initWebSocket();
  },
  watch: {
    wsData: {
      handler() {
        console.log("???");
        console.log(this.wsData.accept);
        console.log(this.wsData["accept"]);
        console.log(this.wsData);
        this.total = this.wsData.total;
        this.accept = this.wsData.accept;
        this.reject = this.wsData.reject;
      }
    }
  },
  destroyed() {
    // 离开页面时关闭websocket连接
    this.ws.close();
  },
  methods: {
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
          that.wsData = JSON.parse(e.data);
        };
      }
    },
    addpoll(result) {
      this.pollform.result = result;
      this.pollform.vote.id = this.vid;
      addpoll(this.vid, this.pollform).then(res => {
        this.showAns = true;
        this.accept = res.data.accept;
        this.reject = res.data.reject;
        this.total = res.data.total;
      });
    },
    toAccept() {},
    roReject() {},
    createVote() {
      console.log("????");
      this.dialog = false;
    },
    goBack() {
      this.$router.go(-1);
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
</style>
