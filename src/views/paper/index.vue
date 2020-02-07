<template>
  <div class="app-container">
    <div class="box">
      <div class="action" @click="dialog = true" style="margin-bottom:10px">
        <el-button type="primary" icon="el-icon-plus">创建论文记录</el-button>
      </div>
      <div v-for="(item, index) in list" :key="index">
        <div class="item">
          <div class="content">
            <el-avatar shape="square" :size="50" :src="squareUrl"></el-avatar>
            <div class="title">
              {{ item.title }}
              <el-tag>{{ item.journal }}</el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="添加论文记录" :visible.sync="dialog" width="50%" center>
      <span>需要注意的是内容是默认不居中的</span>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog = false">确 定</el-button>
        <el-button @click="dialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
      journalrank: [],
      list: [
        {
          title: "The 'Java' extension pack is recommended for this file type.",
          journal: "jhkjhk jkljklkjk lkjljl"
        },
        {
          title: "The 'Java' extension pack is recommended for this file type.",
          journal: "lkjlkj kljljlj lkjlkjl"
        }
      ]
    };
  }
};
</script>
<style scoped>
.app-container {
  background-color: #f5f5f5;
  min-height: 800px;
}
.box {
  background: #fff;
  padding: 20px 20px 0 20px;
}
.item {
  background: #fff;
  padding: 12px;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #f6f6f6;

  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04); */
}
.content {
  height: 50px;
  display: flex;
  justify-content: flex-start;
}
.title {
  padding: 5px 10px;
  display: flex;
  flex-direction: column;
}
</style>
