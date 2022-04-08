<template>
  <div class="app-container">
    <div class="eventDetailWrap">
      <el-card shadow="hover" class="headCard">
        <el-page-header content="活动详情" style="margin-left: 50px" @back="goBack" />
        <div class="eventName">活动名称： {{ eventInfo.name }}</div>
        <div class="eventOtherAttributes">
          <div>{{ typeConverter[eventInfo.type] }}</div>
          <el-divider direction="vertical" class="divider" />
          <div class="eventYear">年份： {{ eventInfo.year }}年</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEventInfo } from '@/api/eventProperty'

export default {
  name: 'EventDetail',
  data() {
    return {
      id: 0,
      typeConverter: ['项目会议', '团队组织/参与的活动', '实验室活动'],
      eventInfo: {
        name: '无活动名！',
        year: 2000,
        type: 0
      }
    }
  },
  created() {
    this.id = this.$route.params.id
    getEventInfo(this.id).then(res => {
      if (res) {
        this.eventInfo = res.data
      }
    }).catch(() => {
      this.$message.error('无法获取活动信息')
    })
  },
  methods: {
    goBack() {
      this.$router.push('/property/event/')
    }
  }
}
</script>

<style scoped>
  .app-container {
    padding: 12px;
    background-color: #fafafa;
    border-radius: 0;
  }

  .eventDetailWrap {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .headCard {
    border-radius: 50px;
    min-height: 150px
  }

  .eventName {
    margin:20px auto auto 40px;
    font-size: x-large;
  }

  .eventOtherAttributes {
    margin:15px auto auto 40px;
    display: flex;
    font-size: small;
    color: #646464;
  }

  .divider {
    height: 16px;
  }

</style>
