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
    <div v-else-if="vote_detail.status === false" v-loading="loading" class="poll">
      <div style="max-width: 500px; margin-left: auto; margin-right: auto">
      <div style="padding:10px; font-size:12px">
        <svg-icon icon-class="date" /> 投票截止
        {{ vote.endTime | parseTime("{y}-{m}-{d} {h}:{i}") }}
        <span v-if="isEnd"> [已结束]</span>
        <el-tooltip content="截止时间后投票无效" placement="right">
          <svg-icon style="margin-left:8px" icon-class="hint" />
        </el-tooltip>
      </div>
      <div v-if="!hasVoted">
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
          <el-button style="width:100%" size="medium" type="success" plain >您的投票结果: {{ vote_detail.myvote }}, 请耐心等待</el-button>
        </div>
      </div>
      </div>
    </div>
    <!-- 投票结果 -->
    <div v-if="vote_detail.status === true" class="poll">
      <div style="padding-bottom:10px; font-size:12px; color:#8c8c8c">
        <span slot="label">
          <svg-icon icon-class="date" /> 投票截止</span>
        {{ vote.endTime | parseTime("{y}-{m}-{d} {h}:{i}") }}
        <span v-if="isEnd"> [已结束]</span>
      </div>
      <el-form>
        <el-form-item style="max-width: 360px">
          <span slot="label">
            <svg-icon icon-class="paper" /> Accept {{ vote_detail.accept }} 票</span>
          <span> {{ getNum(vote_detail.acceptedPercentage) }}% </span>
          <span v-if="vote_detail.myvote === 'accept'" style="color:#409EFF; font-weight:500">[已选]</span>
          <el-progress class="progress" :percentage="getNum(vote_detail.acceptedPercentage)" status="success" />
        </el-form-item>
        <el-form-item style="max-width: 360px">
          <span slot="label">
            <svg-icon icon-class="paper" /> Reject {{ vote_detail.reject }} 票</span>
          {{ getNum(1.0 - vote_detail.acceptedPercentage) }}%
          <span v-if="vote_detail.myvote === 'reject'" style="color:#409EFF; font-weight:500">[已选]</span>
          <el-progress class="progress" :percentage="getNum(1.0 - vote_detail.acceptedPercentage)" status="exception" />
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <i class="el-icon-user" /> 参与人数 {{ vote_detail.total }} 人</span>
          <span v-if="vote_detail.myvote === 'unvote'" style="color:#409EFF; font-weight:500;margin-right:5px">[您未参与投票]
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
            <i class="el-icon-circle-check" /> 接收 {{ vote_detail.accept }} 票:
          </span>

          <el-tag v-for="(item, index) in vote_detail.acceptnames" :key="index" style="margin:0px 4px;">{{ item }}</el-tag>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <i class="el-icon-circle-close" /> 拒绝 {{ vote_detail.reject }} 票:
          </span>

          <el-tag v-for="(item, index) in vote_detail.rejectnames" :key="index" style="margin:0px 4px;">{{ item }}</el-tag>
        </el-form-item>
        <el-form-item v-if="vote_detail.unvotenames.length > 0">
          <span slot="label">
            <i class="el-icon-warning-outline" /> 未投
            {{ vote_detail.unvotenames.length }} 票:
          </span>

          <el-tag v-for="(item, index) in vote_detail.unvotenames" :key="index" type="info" style="margin:0px 4px;">{{ item }}
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
      vote_detail: {
        vid: '',
        status: '',
        accept: '',
        total: '',
        reject: '',
        myvote: '',
        acceptnames: [],
        rejectnames: [],
        unvotenames: [],
        acceptedPercentage: ''
      },
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
      isEnd: false,
      flag: false
    }
  },
  computed: {
    // 投票百分比数值
    getNum() {
      return (val) => {
        return (val * 100.0).toFixed(1)
      }
    },
    hasVoted() {
      return this.vote_detail.myvote !== 'unvote'
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
          this.voteform.endTime = new Date().toISOString().slice(0, 10) + 'T' + this.voteform.endTime
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
          this.vote_detail = res.data
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
    padding: 20px;
    max-width: 480px;
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
    padding: 20px;
    max-width: 1200px;
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
