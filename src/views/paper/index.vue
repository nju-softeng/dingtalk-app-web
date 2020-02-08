<template>
  <div class="app-container">
    <div class="box">
      <div class="action" @click="dialog = true" style="margin-bottom:10px">
        <el-button type="primary" icon="el-icon-plus">创建论文记录</el-button>
      </div>
      <div v-for="(item, index) in list" :key="index">
        <div class="item">
          <div class="content">
            <!-- <el-avatar shape="square" :size="50" :src="squareUrl"></el-avatar> -->
            <div class="title">
              {{ item.title }}
              <el-tag>{{ item.journal }}</el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-drag-select
      v-model="value"
      style="width:500px;"
      multiple
      placeholder="请选择"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-drag-select>

    <el-dialog title="添加论文记录" :visible.sync="dialog" width="50%" center>
      <div class="paper-form">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="论文名称">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="投稿地点">
            <el-input></el-input>
          </el-form-item>

          <el-form-item label="论文分类">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item> </el-form-item>
        </el-form>
      </div>

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
      author: [],
      dialog: false,
      journalrank: [],
      userlist: [],
      options: [
        {
          value: 1,
          label: "Journal A"
        },
        {
          value: 2,
          label: "Conference A"
        },
        {
          value: 3,
          label: "Journal B"
        },
        {
          value: 4,
          label: "Conference B"
        },
        {
          value: 5,
          label: "Journal C"
        },
        {
          value: 6,
          label: "Conference C"
        }
      ],
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
.paper-form >>> .el-input__inner {
  width: 220px;

  border-end-end-radius: 0;
  /*outline: medium;*/
}
.app-container {
  background-color: #f5f5f5;
  min-height: 750px;
  border-radius: 0;
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
