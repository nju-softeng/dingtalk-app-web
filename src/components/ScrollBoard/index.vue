<template>
  <div>
    <el-table
      v-loading="loading"
      :data="scrollBoardData"
      style="width: 100%;"
      max-height="150px"
      @row-click="handleRowClick"
    >
      <!-- <el-table-column label="#" prop="id" width="50"> </el-table-column> -->
      <el-table-column label="发布时间" width="150">
        <template slot-scope="scope">
          {{ formatTime(scope.row.releaseTime) }}
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="300">
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            :content="scope.row.title"
            placement="top-start"
          >
            <span class="title">
              {{ scope.row.title }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column prop="authorName" label="发布人" width="150" />
    </el-table>
    <el-dialog
      title="公告详情"
      :visible.sync="newsContentVisible"
      width="400px"
    >
      <v-md-editor v-model="activeRow.content" mode="preview" />
    </el-dialog>
  </div>
</template>

<script>
import { getShownNews } from '@/api/scrollBoard.js'

export default {
  name: 'ScrollBoard',
  data() {
    return {
      scrollBoardData: [],
      number: 0,
      isScroll: true,
      newsContentVisible: false,
      activeRow: {
        content: ''
      },
      loading: false
    }
  },
  created() {
    this.loading = true
    getShownNews()
      .then((res) => {
        console.log(res.data)
        this.scrollBoardData = res.data.data
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        this.loading = false
      })
    this.$nextTick(() => {
      const div = document.getElementsByClassName('el-table__body-wrapper')[0]
      div.style.height = '120px'
      div.addEventListener('mouseenter', () => {
        this.isScroll = false
        console.log(this.isScroll)
      })
      div.addEventListener('mouseleave', () => {
        this.isScroll = true
      })
      const t = document.getElementsByClassName('el-table__body')[0]
      setInterval(() => {
        if (this.isScroll) {
          const data = this.scrollBoardData[0]
          setTimeout(() => {
            this.scrollBoardData.push(data)
            t.style.transition = 'all .5s'
            t.style.marginTop = '-41px'
          }, 500)
          setTimeout(() => {
            this.scrollBoardData.splice(0, 1)
            t.style.transition = 'all 0s ease 0s'
            t.style.marginTop = '0'
          }, 1000)
        }
      }, 2500)
    })
  },
  methods: {
    formatTime(time) {
      return time.replace('T', ' ')
    },
    handleRowClick(row) {
      this.newsContentVisible = true
      this.activeRow = { ...row }
      if (this.activeRow.content === '') this.activeRow.content = '无详情'
    }
  }
}
</script>

<style scoped>
h2 {
  padding: 20px 0;
}
.textBox {
  width: 100%;
  height: 40px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  text-align: center;
}
.text {
  width: 100%;
  position: absolute;
  bottom: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s linear;
}
.slide-enter {
  transform: translateY(20px) scale(1);
  opacity: 1;
}
.slide-leave-to {
  transform: translateY(-20px) scale(0.8);
  opacity: 0;
}

.title {
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
