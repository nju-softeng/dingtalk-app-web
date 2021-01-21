<template>
  <div class="vote" :v-loading="loading">
    <!-- 创建投票 -->
    <div v-if="vote == ''" class="create">
      <div>
        <p>发起投票</p>
      </div>
      <div v-loading="loading" style="display:flex; ">
        <el-form ref="voteform" style="width:240px" :model="voteform">
          <el-form-item
            prop="endTime"
            :rules="{
              required: true,
              message: '请选择截止时间',
              trigger: 'change'
            }"
          >
            <span slot="label">截止时间 </span>
            <el-time-picker
              v-model="voteform.endTime"
              style="width:150px"
              value-format="HH:mm"
              format="HH:mm"
              :picker-options="{
                selectableRange: '07:00:00 - 21:30:00'
              }"
              placeholder="选择时间"
            />
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

    <!-- 投票div -->
    <div v-else-if="showAns  == false " v-loading="loading" class="poll">
      <div style="padding:10px; font-size:12px">
        <svg-icon icon-class="date" /> 投票截止
        {{ vote.endTime | parseTime("{y}-{m}-{d} {h}:{i}") }}
        <span v-if="isEnd"> [已结束]</span>
        <el-tooltip content="截止时间后投票无效" placement="right">
          <svg-icon style="margin-left:8px" icon-class="hint" />
        </el-tooltip>
      </div>
      <div v-if="!isVoted">
        <div>
          <div class="choice">
            <el-radio v-model="pollform.result" class="radio" border label="true">ACCEPT [接受]</el-radio>
          </div>
          <div class="choice">
            <el-radio v-model="pollform.result" class="radio" border label="false">REJECT [拒绝]</el-radio>
          </div>
        </div>
        <div style="padding:10px">
          <el-button style="width:100%" size="medium" type="primary" @click="voting">确认提交</el-button>
        </div>
      </div>
      <div v-else>
        <div style="padding:10px">
          <el-button style="width:100%" size="medium" type="success" plain >您的投票结果: {{ myresult ? "Accept" : "Reject" }}, 请耐心等待</el-button>
        </div>
      </div>

    </div>
    <!-- 投票结果 -->
    <div v-if="showAns == true" class="poll">
      <div style="padding-bottom:10px; font-size:12px; color:#8c8c8c">
        <span slot="label">
          <svg-icon icon-class="date" /> 投票截止</span>
        {{ vote.endTime | parseTime("{y}-{m}-{d} {h}:{i}") }}
        <span v-if="isEnd"> [已结束]</span>
      </div>
      <el-form>
        <el-form-item>
          <span slot="label">
            <svg-icon icon-class="paper" /> Accept {{ accept }} 票</span>
          <span> {{ getNum(accept, total) }}% </span>
          <span v-if="myresult == true" style="color:#409EFF; font-weight:500">[已选]</span>
          <el-progress class="progress" :percentage="getpercentage(accept, total)" status="success" />
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <svg-icon icon-class="paper" /> Reject {{ reject }} 票</span>
          {{ getNum(reject, total) }}%
          <span v-if="myresult == false" style="color:#409EFF; font-weight:500">[已选]</span>
          <el-progress class="progress" :percentage="getpercentage(reject, total)" status="exception" />
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <i class="el-icon-user" /> 参与人数 {{ total }} 人</span>
          <span v-if="myresult == undefined" style="color:#409EFF; font-weight:500;margin-right:5px">[您未参与投票]
          </span>
          <el-link
            type="primary"
            :underline="false"
            @click="
              flag = true;
              fetchVoteDetail();
            "
          >详情
          </el-link>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="flag" class="poll" style="padding-top:0px">
      <el-form>
        <el-form-item>
          <span slot="label">
            <i class="el-icon-circle-check" /> 接收 {{ accept }} 票:
          </span>

          <el-tag v-for="(item, index) in acceptlist" :key="index" style="margin:0px 4px;">{{ item }}</el-tag>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <i class="el-icon-circle-close" /> 拒绝 {{ reject }} 票:
          </span>

          <el-tag v-for="(item, index) in rejectlist" :key="index" style="margin:0px 4px;">{{ item }}</el-tag>
        </el-form-item>
        <el-form-item v-if="unvotelist.length > 0">
          <span slot="label">
            <i class="el-icon-warning-outline" /> 未投
            {{ unvotelist.length }} 票:
          </span>

          <el-tag v-for="(item, index) in unvotelist" :key="index" type="info" style="margin:0px 4px;">{{ item }}
          </el-tag>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getPaperVote, getVoteDetailByVid, createVote, addPoll } from '@/api/paper'
import { getExPaperVote } from '@/api/ex-paper'
export default {
  data() {
    return {
      loading: false,
      voteform: {
        paperid: '',
        endTime: ''
      },
      pid: null,
      vote: {
        id: ''
      },
      pollform: {
        result: '',
        vid: ''
      },
      showAns: false,
      vid: '',
      accept: '',
      reject: '',
      isEnd: false,
      isVoted: false,
      acceptlist: [],
      rejectlist: [],
      unvotelist: [],
      total: '',
      myresult: undefined,
      flag: false
    }
  },
  computed: {
    // 投票百分比
    getpercentage() {
      return (val, total) => {
        if (total === 0) {
          return 0
        }
        return (val / total) * 100
      }
    },
    // 投票百分比数值
    getNum() {
      return (val, total) => {
        if (total === 0) {
          return 0
        }
        return (val / total).toFixed(2) * 100
      }
    }
  },
  created() {
    this.loading = true
    this.pid = this.$route.params.id
    const path = this.$route.path

    if (path.slice(7, 16) === 'ex-detail') {
      // 如果是外部评审投票，则直接显示投票按钮
      getExPaperVote(this.pid)
        .then(res => {
          this.vote = res.data
          console.log(this.vote)
          this.isEnd = res.data.status
          this.fetchVoteDetail().then(() => {
            this.initWebSocket()
          })
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false
          }, 300)
        })
    } else {
      // 如果是内部论文投票，则需先发起投票
      getPaperVote(this.pid)
        .then(res => {
          this.vote = res.data
          console.log(this.vote)
          this.isEnd = res.data.status
          if (this.vote.id !== undefined) {
            this.fetchVoteDetail().then(() => {
              this.initWebSocket()
            })
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false
          }, 300)
        })
    }
  },
  destroyed() {
    // 离开页面时关闭websocket连接
    if (this.ws !== undefined) {
      this.ws.close()
    }
  },
  methods: {
    // 创建的投票
    submitvote() {
      this.$refs.voteform.validate(valid => {
        if (valid) {
          this.loading = true
          this.voteform.paperid = this.pid
          createVote(this.voteform)
            .then(res => {
              console.log(res.data)
              this.vote = res.data
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    // 获取投票详情
    fetchVoteDetail() {
      return new Promise((resolve, reject) => {
        getVoteDetailByVid(this.vote.id).then(res => {
          console.log('获取投票详情数据')
          console.log(res.data)
          this.isVoted = res.data.myresult !== undefined
          this.showAns = res.data.status
          this.vid = res.data.vid
          if (this.showAns) {
            this.accept = res.data.accept
            this.reject = res.data.reject
            this.total = res.data.total
            this.myresult = res.data.myresult
            this.acceptlist = res.data.acceptnames
            this.rejectlist = res.data.rejectnames
            this.unvotelist = res.data.unvotenames || []
          }
          console.log(this.isVoted)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 初始化websocket
    initWebSocket() {
      const that = this
      if (window.WebSocket) {
        var url = 'ws://' + location.host + '/wsapi'
        console.log('location.host for websocket: ' + url)
        const ws = new WebSocket(url)
        that.ws = ws
        ws.onopen = function() {
          console.log('服务器连接成功: ' + url)
        }
        ws.onclose = function() {
          console.log('服务器连接关闭: ' + url)
        }
        ws.onerror = function() {
          console.log('服务器连接出错: ' + url)
        }
        ws.onmessage = function(e) {
          // 接收服务器返回的数据
          console.log('websocket 接收到数据：')
          const data = JSON.parse(e.data)
          // 判断websocket更新的投票数据，是否为当前页面的投票，若是则更新数据
          if (data.vid === that.vid) {
            if (data.isEnd) {
              that.fetchVoteDetail()
              return
            }
            that.total = data.total
            that.accept = data.accept
            that.reject = data.reject
            that.acceptlist = data.acceptnames
            that.rejectlist = data.rejectnames
          }
        }
      }
    },
    voting() {
      this.pollform.vid = this.vote.id
      this.loading = true
      addPoll(this.vote.id, this.pollform)
        .then(res => {
          // this.showAns = true
          this.myresult = res.data.myresult
          this.accept = res.data.accept
          this.reject = res.data.reject
          this.total = res.data.total
          this.isVoted = true
        })
        .catch(error => {
          if (error.response.data.status === 409) {
            this.fetchVoteDetail()
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.create {
  width: 400px;
  font-family: "Segoe UI";
  padding-top: 50px;
  margin-left: auto;
  margin-right: auto;
}
.choice {
  padding: 4px 10px;
  .radio {
    padding: 10px;
    height: 40px;
    width: 100%;
  }
}
.vote {
  background: #fff;
  min-height: calc(100vh - 280px);
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
