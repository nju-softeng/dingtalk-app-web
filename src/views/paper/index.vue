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

    <el-dialog title="添加论文记录" :visible.sync="dialog" width="70%" center>
      <div class="dialog-content">
        <div class="paper-form">
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item>
              <span slot="label"><svg-icon icon-class="paper" /> 论文名称</span>
              <el-input style="width:1000px"></el-input>
            </el-form-item>
            <el-form-item>
              <span slot="label"
                ><svg-icon icon-class="school" /> 投稿地点</span
              >
              <el-input></el-input>
            </el-form-item>

            <el-form-item>
              <span slot="label"><svg-icon icon-class="grade" /> 论文分类</span>
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
            <el-form-item>
              <span slot="label"
                ><svg-icon icon-class="people" /> 论文作者</span
              >
              <el-autocomplete
                v-model="state"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="test"></div>

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
      state: "",
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
  },
  methods: {
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
    }
  }
};
</script>
<style scoped>
.paper-form {
  display: flex;
  background-color: yellow;
}

.test {
  background-color: red;
  height: 100px;
}

.dialog-content {
  background-color: aquamarine;
  display: flex;
}

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
