<template>
  <div>
    <div v-if="messages.length != 0" style="min-height:200px">
      <div v-for="(msg, index) in messages" :key="index" class="message">
        <div class="title">{{ msg.title }}</div>
        <span class="time">{{ msg.createTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        <div style="display:flex; justify-content:space-between;">
          <div class="detail">
            <span>{{ msg.content }}</span>
          </div>
          <!-- <div class="time">
            <span>{{ msg.createTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
          </div> -->
        </div>
      </div>
    </div>
    <template v-else>
      <div style="height:200px;text-align:center;padding-top:70px;">
        <svg-icon icon-class="null" style="font-size:32px" />
      </div>
    </template>
    <div style="text-align:center">
      <el-pagination background :hide-on-single-page="total < 10 ? true : false" small layout="prev, pager, next" :total="total" :page-size="10" @prev-click="handlePrev" @next-click="handleNext" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { getMessages } from '@/api/message'
export default {
  data() {
    return {
      messages: [],
      total: 0
    }
  },
  created() {
    // 消息
    getMessages(0, 10).then(res => {
      this.messages = res.data.content || []
      this.total = res.data.total || 0
    })
  },
  methods: {
    // 分页获取数据
    handleCurrentChange(val) {
      getMessages(val - 1, 10).then(res => {
        this.messages = res.data.content
      })
    },
    handlePrev(val) {
      getMessages(val - 1, 10).then(res => {
        this.messages = res.data.content
      })
    },
    handleNext(val) {
      getMessages(val - 1, 10).then(res => {
        this.messages = res.data.content
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.message {
  height: 72px;
  padding-top: 7px;
  padding-bottom: 10px;
  font-size: 14px;
  border-bottom: 0.5px solid #d2d6de;
  margin-bottom: 4px;

  .title {
    color: #1890ff;
    line-height: 24px;
    height: 24px;
    font-size: 14px;
    display: inline-block;
  }
  .detail {
    font-size: 12px;
    padding-top: 6px;
    white-space: pre;
  }
  .time {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    padding-top: 6px;
    padding-left: 15px;
  }
}
</style>
