<template>
  <div>
    <div class="md-container">
      <div style=" margin-right:16px">
        <el-avatar :src="avatar"> {{ name }}</el-avatar>
      </div>
      <div>
        <v-md-editor @save="save" v-model="value" mode="edit" height="280px" style="width:928px" />
        <el-button @click="submit" style="margin-top:8px"> 提交</el-button>
      </div>
    </div>
    <div style="overflow: auto;">
      <div class="md-container" v-for="(item, index) in list" :key="index" style="margin-bottoom:16px">
        <div style=" margin-right:16px; margin-top:16px">
          <el-avatar :src="item.user.avatar">{{ item.user.name }}</el-avatar>
        </div>
        <div style="flex-grow:1">
          <p>
            <span style="font-size:14px;">{{ item.user.name }} </span>
            <span style=" font-size:12px; color:#595959; padding:8px">
              {{ item.updateTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
            <template v-if="uid == item.user.id">
              <el-button type="text" @click="item.edit = true" style="margin-right:4px">编辑</el-button>
              <el-popconfirm confirmButtonText="好的" cancelButtonText="不用了" icon="el-icon-info" iconColor="red" title="这是一段内容确定删除吗？" @onConfirm="remove(item.id)">
                <el-button slot="reference" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </p>
          <div>
            <v-md-editor v-model="item.md" :mode="item.edit == false ? 'preview' : 'edit'"></v-md-editor>
            <div style="margin-top:8px" v-if="item.edit == true">
              <el-button @click="update(item)"> 提交</el-button>
              <el-button @click="item.edit = false"> 取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  submitReview,
  listReview,
  updateReview,
  deleteReview
} from "@/api/paper";
export default {
  data() {
    return {
      value: "",
      list: [],
      uid: null,
      avatar: "",
      name: ""
    };
  },
  created() {
    this.fetchReview();
    this.value = localStorage.getItem("review-content") || "";
    this.uid = sessionStorage.getItem("uid");
    this.avatar = sessionStorage.getItem("avatar");
    this.name = sessionStorage.getItem("name");
  },
  props: ["paperid"],
  methods: {
    fetchReview() {
      listReview(this.paperid).then(res => {
        this.list = res.data;
        this.list.forEach(item => {
          this.$set(item, "edit", false);
        });
      });
    },
    edit(data) {
      data.edit = true;
      console.log(data);
    },
    save() {
      localStorage.setItem("review-content", this.value);
    },
    submit() {
      if (this.value == "") {
        this.$notify({
          title: "内容不能为空",
          message: "这是一条成功的提示消息",
          type: "warning"
        });
        return;
      }
      submitReview({
        paperid: this.paperid,
        md: this.value
      }).then(() => {
        this.fetchReview();
        this.value = "";
        this.$notify({
          title: "成功",
          message: "评审意见提交成功",
          type: "success"
        });
      });
    },
    update(data) {
      updateReview(data, this.paperid).then(() => {
        this.fetchReview();
        this.value = "";
        this.$notify({
          title: "更新成功",
          type: "success"
        });
      });
    },
    remove(id) {
      deleteReview(id).then(() => {
        this.fetchReview();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.md-container {
  display: flex;
}
</style>
