<template>
  <div>
    <el-row :gutter="10">
      <el-col v-for="(item,index) in list" :xs="24" :sm="8" :md="6" :lg="6">
        <div class="card">
          <div>
            <div class="title" style="min-height: 53px">
              {{ item.title }}
            </div>
            <div class="info">
              <div class="info-item">投票时间</div>
              <div class="info-item">{{ item.vote.startTime | parseTime("{h}:{i}") }} ~ {{ item.vote.endTime | parseTime("{h}:{i}") }}</div>
            </div>
          </div>

          <div class="action" style=" display:flex; justify-content: flex-end; align-items: center; padding-right: 5px;">
            <el-button circle plain type="primary" icon="el-icon-edit" @click="modifyExPaper(item)"/>
            <el-button circle plain type="danger" icon="el-icon-delete" @click="rmExPaper(item.id)" />
            <!--            <div style="margin-right: 20px"><i class="el-icon-edit" /></div>-->
            <!--            <div style="margin-right: 20px"><i class="el-icon-share" /></div>-->
            <!--            <div style="margin-right: 20px"><i class="el-icon-delete" /></div>-->

          </div>
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import { listExPaper, deleteExPaper } from '@/api/ex-paper'

export default {
  name: 'PaperExternal',
  data() {
    return {
      list: [],
      role: null
    }
  },
  created() {
    this.fetchExPaper()
    this.role = sessionStorage.getItem('role')
    this.$message({
      showClose: true,
      message: '外部评审正在开发中，目前无法使用',
      type: 'warning',
      offset: '100',
      duration: '5000'
    })
  },
  mounted() {
  },
  methods: {
    fetchExPaper() {
      listExPaper().then(res => {
        this.list = res.data
        console.log(this.list)
      })
    },
    // 是否有审核权限
    hasAuth() {
      if (this.role === 'admin' || this.role === 'auditor') {
        return true
      } else {
        return false
      }
    },
    // 修改论文记录
    modifyExPaper(item) {
      if (this.hasAuth()) {
        this.$emit('modifyExternal', item)
      } else {
        this.$message({
          message: '只有审核人才可以操作',
          type: 'warning'
        })
      }
    },
    rmExPaper(id) {
      if (!this.hasAuth()) {
        this.$message({
          message: '只有审核人才可以操作',
          type: 'warning'
        })
        return;
      }
      this.$confirm('对应的投票和AC记录也会被删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteExPaper(id).then(() => {
          this.fetchExPaper()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }

}
</script>

<style lang="scss" scoped>

.card {
  margin-bottom:10px;
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #FFFFFF;
  .title {
    padding: 16px 16px 1px;
  }
  .info {
    height: 64px;
    .info-item {
      text-align:center;
      padding-top:12px;
      font-size: 13px;
    }
  }
  .action {
    height: 40px;
    border-top: 1px solid #e6ebf5;
    //background: #e5e9f2;
  }

}

.title {
  overflow:hidden;
  text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
}
.box-card {
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
