<template>
  <div class="app-container">
    <div class="box">
      <div class="action" style="margin-bottom:10px">
        <el-button type="primary" @click="dialog = true" icon="el-icon-plus">创建论文记录</el-button>
      </div>
      <div v-for="(item, index) in list" :key="index">
        <div class="item">
          <div class="content">
            <!-- <el-avatar shape="square" :size="50" :src="squareUrl"></el-avatar> -->

            <div class="left-content" @click="more()">
              <div class="title">
                <a>
                  <svg-icon icon-class="paper" /> {{ item.title }} </a>
              </div>
              <div style="display:flex" class="detail">
                <div class="journal">
                  <svg-icon icon-class="school" /> {{ item.journal }}
                </div>
                <div class="time">
                  <svg-icon icon-class="date" />
                  {{ item.date }}
                </div>
              </div>
            </div>
            <div class="info-item namelist">
              <span>论文参与者</span>
              <div style="padding:5px;">
                <span style="padding:5px;" v-for="o in item.authors" :key="o.index">{{ o.name }}</span>
              </div>
            </div>

            <div class="info-item">
              <span>xxxx</span>
              <span style="padding:5px;">{{ item.date }}</span>
            </div>

            <div class="info-item">
              <span>xxxx</span>
              <span style="padding:5px;">{{ item.date }}</span>
            </div>

            <div class="info-item">
              <span>xxxx</span>
              <span style="padding:5px;">{{ item.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="dialog" :custom-class="test" width="60%" center>
      <div slot="title" class="header-title">
        <span class="title-age">内部论文评审记录 </span>
      </div>

      <div class="dialog-content">
        <div class="paper-form">
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="paper" /> 论文名称</span>
              <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="school" /> 投稿地点</span>
              <el-input v-model="form.journal"></el-input>
            </el-form-item>

            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="grade" /> 论文分类</span>
              <el-select v-model="form.level" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-button type="text" style="margin-left:10px;" icon="el-icon-plus">添加作者</el-button>
            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="people" /> 论文作者</span>
              <el-button type="primary" @click="dialog = true" icon="el-icon-plus"></el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog = false">确 定</el-button>
        <el-button @click="dialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getUserList } from "@/api/common";
export default {
  data() {
    return {
      userlist: [],
      author: [],
      dialog: false,
      journalrank: [],
      state: "",
      form: {
        title: null,
        journal: null,
        level: null
      },
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
          title:
            "The 'Java' extension pack is recommended for this file typekkkkkkkkkkkkkkkkk",
          journal: "jhkjhk jkljklkjk lkjljl",
          date: "2020-02-10",
          authors: [
            {
              id: 2,
              name: "name1"
            },
            {
              id: 3,
              name: "name2"
            },
            {
              id: 4,
              name: "name3"
            },
            {
              id: 2,
              name: "name1"
            },
            {
              id: 3,
              name: "name2"
            }
          ]
        },
        {
          title: "The 'Java' extension pack is recommended for this file type.",
          journal: "123 456 789 10 11 12 13 14 15 16 17 18",
          date: "2020-02-10"
        }
      ]
    };
  },
  created() {
    getUserList().then(res => {
      this.userlist = res.data;
      console.log(this.userlist);
    });
  },
  methods: {
    more() {},
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
<style lang="scss" scoped>
.header-title {
}

.test {
  border-radius: 8px;
  width: 90%;
}
.el-form {
  width: 600px;
}
.paper-form {
  display: flex;
  // background-color: yellow;
}

.dialog-content {
  // background-color: aquamarine;
  display: flex;
  justify-content: center;
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
  padding: 12px 12px 12px 0;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #f6f6f6;
  .left-content {
    display: flex;
    flex-direction: column;
    .title {
      color: #1897ff;
      font-weight: 500;
      margin-bottom: 5px;
      width: 400px;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .detail {
      color: gray;
      font-size: 13px;
      padding-top: 5px;
      .journal {
        width: 250px;
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .time {
        padding-left: 5px;
      }
    }
  }
  .namelist {
    width: 200px;
    padding: 0 20px;
  }
  .info-item {
    color: gray;
    display: flex;
    flex-direction: column;
    padding-left: 48px;
    font-size: 13px;
    align-items: center;
  }
}
.content {
  height: 50px;
  display: flex;
  justify-content: flex-start;
}
</style>
