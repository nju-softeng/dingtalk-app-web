<template>
  <div>
    <div class="list">
      <el-table :data="list" class="tableClass">
        <el-table-column label="组内评审文件" />
        <el-table-column label="提交时文件" />
        <el-table-column label="发表版本文件" />
        <el-table-column label="发表版本LATEX文件" />
        <el-table-column label="评审结果" />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DigitalDoc',
  data() {
    return {
      list: []
    }
  },
  created() {
    this.$router.push('/paper/index/internal').then(() => {
      this.$message.success('已为你自动跳转至论文管理')
    })
  }
}
</script>

<style lang="scss" scoped>
  .pagination {
    margin-top:16px;
    display:flex;
    justify-content:center;
  }

  .list {
    min-height: 500px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }

  .paper-item {
    padding: 3px 12px 3px 0;
    border-width: 0 0 1px 0;
    .left-content {
      font-size: 13px;
      display: flex;
      flex-direction: column;
      .title {
        a {
          color: #0366d6;
        }
        color: #409eff;
        font-weight: 500;
        margin-bottom: 5px;
        width: 330px;
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .detail {
        display: flex;
        color: gray;
        font-size: 13px;
        padding-top: 7px;
        .journal {
          width: 180px;
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .time {
          padding-left: 5px;
        }
      }
    }
    //
    //.info-item {
    //  color: gray;
    //  display: flex;
    //  justify-content: flex-start;
    //  font-size: 13px;
    //  align-items: center;
    //}
  }

  .namelist {
    min-width: 100px;
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap;
    text-overflow: ellipsis;
  }

</style>
