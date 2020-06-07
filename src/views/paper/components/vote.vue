<template>
  <div class="vote">
    <div style="margin-left: auto; margin-right: auto;">
      jkhkjh
    </div>
  </div>
</template>
<script>
import { getPaper, getVoteDetail, addpoll } from "@/api/paper";
export default {
  data() {
    return {
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
      myresult: undefined,
      pollform: {
        result: "",
        vote: {
          id: ""
        }
      }
    };
  },

  created() {
    this.pid = this.$route.params.id;
    getPaper(this.pid).then(res => {
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
    }
  },
  computed: {
    // 投票百分比
    getpercentage() {
      return (val, total) => {
        if (total == 0) {
          return 0;
        }
        return (val / total) * 100;
      };
    },
    // 投票百分比数值
    getNum() {
      return (val, total) => {
        if (total == 0) {
          return 0;
        }
        return (val / total).toFixed(2) * 100;
      };
    },
    // 时间格式化
    getddl() {
      return (st, et) => {
        return st + " " + et.slice(0, 5);
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.vote {
  background: #fff;
  min-height: 50vh;
}
</style>
