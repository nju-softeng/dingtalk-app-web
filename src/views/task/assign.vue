<template>
  <div class="app-container">
    <div class="box">
      <div class="action" style="margin-bottom:10px">
        <el-button type="primary" @click="" icon="el-icon-plus">创建迭代记录</el-button>
      </div>
    </div>

    <el-dialog :visible.sync="dialog" top="10vh" @closed="closeDialog" width="60%" center>
      <div slot="title" class="header-title">
        <span class="title-age">内部论文评审记录 </span>
      </div>

      <div class="dialog-content">
        <div class="paper-form">
          <el-form ref="paperform" :model="paperform" label-width="110px">
            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="paper" /> 论文名称</span>
              <el-input v-model="paperform.title"></el-input>
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="school" /> 投稿地点</span>
              <el-input v-model="paperform.journal"></el-input>
            </el-form-item>

            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="grade" /> 论文分类</span>
              <el-select v-model="paperform.level" placeholder="请选择">
                <el-option v-for="item in options" :key="item.index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item v-for="(author, index) in paperform.paperDetails" :prop="'paperDetails.' + index + '.user.id'" :key="index">
              <span slot="label">
                <svg-icon icon-class="people" /> 论文作者 {{ index + 1 }}</span>

              <el-select v-model="author.user.id" filterable placeholder="请选择">
                <el-option v-for="item in userlist" :key="item.index" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-button type="text" @click="addAuthor" style="margin-left:20px;" icon="el-icon-plus">添加作者</el-button>
            <el-button type="text" @click="rmAuthor" style="margin-left:20px;" icon="el-icon-minus">减少作者</el-button>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit(paperform)">确 定</el-button>
        <el-button @click="dialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getUserList } from "@/api/common";
import { addPaper, listPaper } from "@/api/paper";
export default {
  data() {
    return {
      flag: false,
      userlist: [],
      author: [],
      dialog: false,
      journalrank: [],
      state: "",
      paperform: {
        title: null,
        journal: null,
        level: null,
        paperDetails: [
          {
            num: 1,
            user: {
              id: ""
            }
          }
        ]
      },

      list: []
    };
  },
  created() {
    getUserList().then(res => {
      this.userlist = res.data;
    });
    listPaper().then(res => {
      this.list = res.data;
    });
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addPaper(this.paperform).then(() => {
            this.dialog = false;
            this.$notify({
              title: "成功",
              message: "论文记录创建成功",
              type: "success"
            });
            listPaper().then(res => {
              this.list = res.data;
            });
          });
        } else {
          this.$notify({
            title: "提交失败",
            message: "请填写必要信息",
            type: "warning"
          });
        }
      });
    },
    closeDialog() {
      this.$refs.paperform.resetFields();
    },
    addAuthor() {
      let val = this.paperform.paperDetails.length + 1;
      this.paperform.paperDetails.push({
        num: val,
        user: {
          id: ""
        }
      });
    },
    rmAuthor() {
      if (this.paperform.paperDetails.length != 1) {
        this.paperform.paperDetails.pop();
      }
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
  width: 618px;
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
  min-height: 60px;
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
