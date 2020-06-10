<template>
  <div class="vote" :v-loading="loading">
    <div v-if="vote == ''" style="width:400px;margin-left: auto; margin-right: auto;">
      <div style="font-family: 'Segoe UI'; padding-top:60px">
        <p>发起投票</p>
      </div>
      <div v-loading="loading" style="display:flex; flex-">
        <el-form style="width:240px" ref="voteform" :model="voteform">
          <el-form-item prop="endTime" :rules="{
              required: true,
              message: '请选择截止时间',
              trigger: 'change'
            }">
            <span slot="label">截止时间 </span>
            <el-time-picker style="width:150px" arrow-control v-model="voteform.endTime" value-format="HH:mm:ss" :picker-options="{
                selectableRange: '08:30:00 - 21:30:00'
              }" placeholder="选择时间">
            </el-time-picker>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="submitvote">确 定</el-button>
        </div>
      </div>
      <span style="font-size:12px">
        <i class="el-icon-info">
          自动向钉钉群推送投票消息
        </i>
      </span>
    </div>
    <div v-else-if="showAns == false" class="poll" v-loading="loading">
      <div style="padding:10px; font-size:12px">
        <span slot="label">
          <svg-icon icon-class="date" /> 投票截止</span>
        {{ getddl(vote.startTime, vote.endTime) }}
        <span v-if="isEnd"> [已结束]</span>
        <el-tooltip class="item" effect="dark" content="截止时间后投票无效" placement="right">
          <span style="margin-left:8px">
            <svg-icon icon-class="hint" /></span>
        </el-tooltip>
      </div>

      <div>
        <div style="padding-left:10px; padding-right:10px">
          <el-radio style="padding:10px;height:40px;width:100%" v-model="pollform.result" border label="true">ACCEPT [接受]</el-radio>
        </div>
        <div style="padding-left:10px; padding-right:10px">
          <el-radio style="padding:10px;height:40px;width:100%" v-model="pollform.result" border label="false">REJECT [拒绝]</el-radio>
        </div>
      </div>
      <div style="padding:10px">
        <el-button style="width:100%" size="medium" @click="voting" type="primary">确认提交</el-button>
      </div>
    </div>
    <div v-if="showAns == true" class="poll">
      <div style="padding-bottom:10px; font-size:12px; color:#8c8c8c">
        <span slot="label">
          <svg-icon icon-class="date" /> 投票截止</span>
        {{ getddl(vote.startTime, vote.endTime) }}
        <span v-if="isEnd"> [已结束]</span>
      </div>
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
          <el-link type="primary" :underline="false" @click="flag = true">详情
          </el-link>
        </el-form-item>
      </el-form>
    </div>
    <div class="poll" v-if="flag">
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
    </div>
  </div>
</template>
<script>
import { getPaperVote, getVoteDetail, createVote, addpoll } from "@/api/paper";
export default {
  data() {
    return {
      loading: false,
      voteform: {
        paperid: "",
        endTime: ""
      },
      pid: null,
      vote: {},
      pollform: {
        result: "",
        vote: {
          id: ""
        }
      },
      showAns: false,
      accept: "",
      reject: "",
      isEnd: "false",
      acceptlist: [],
      rejectlist: [],
      total: "",
      myresult: undefined,
      flag: false
    };
  },

  created() {
    this.loading = true;
    this.pid = this.$route.params.id;

    //todo 修改， 拿论文对应的投票
    getPaperVote(this.pid)
      .then(res => {
        this.vote = res.data;
        this.isEnd = res.data.status;
        if (this.vote.id != undefined) {
          this.fetchVoteDetail();
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.loading = false;
        }, 400);
      });

    this.initWebSocket();
  },
  destroyed() {
    // 离开页面时关闭websocket连接
    this.ws.close();
  },
  methods: {
    // 创建的投票
    submitvote() {
      this.$refs.voteform.validate(valid => {
        if (valid) {
          this.loading = true;
          this.voteform.paperid = this.pid;
          createVote(this.voteform)
            .then(res => {
              console.log(res.data);
              this.vote = res.data;
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    //获取投票详情
    fetchVoteDetail() {
      getVoteDetail(this.pid).then(res => {
        console.log(res.data);
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
    },

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
    voting() {
      this.pollform.vote.id = this.vote.id;
      this.loading = true;
      addpoll(this.vote.id, this.pollform)
        .then(res => {
          this.showAns = true;
          this.accept = res.data.accept;
          this.reject = res.data.reject;
          this.total = res.data.total;
        })
        .finally(() => {
          this.loading = false;
        });
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
        if (et == undefined) {
          return;
        }
        return st + " " + et.slice(0, 5);
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.vote {
  background: #fff;
  min-height: 80vh;
}

@media only screen and (max-width: 767px) {
  .poll {
    margin-left: auto;
    margin-right: auto;
    padding-top: 20px;
    width: 300px;
    .vote-item {
      padding-inline-start: 0px;
      > li {
        border: 1px solid #f0f0f0;
        padding: 10px;
        list-style-type: none;
      }
      padding: 10px;
    }
  }
}

@media only screen and (min-width: 768px) {
  .poll {
    margin-left: auto;
    margin-right: auto;
    padding-top: 20px;
    width: 400px;
    .vote-item {
      padding-inline-start: 0px;
      > li {
        border: 1px solid #f0f0f0;
        padding: 10px;
        list-style-type: none;
      }
      padding: 10px;
    }
  }
}
</style>
