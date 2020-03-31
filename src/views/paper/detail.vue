<template>
  <div>
    <el-page-header @back="goBack">
      <span slot="title" style="font-size:12.5px">
        返回
      </span>
    </el-page-header>

    <div class="box">
      <div class="test">
        <el-form>
          <el-form-item>
            <span slot="label">
              <svg-icon icon-class="paper" /> 论文名称</span>
            {{ paper.title }}
          </el-form-item>
          <el-form-item>
            <span slot="label">
              <svg-icon icon-class="school" /> 投稿地点</span>
            {{ paper.journal }}
          </el-form-item>
          <el-form-item>
            <span slot="label">
              <svg-icon icon-class="grade" /> 论文分类</span>
            {{ getlevel(paper.level) }}
          </el-form-item>
          <el-form-item>
            <span slot="label">
              <svg-icon icon-class="people" /> 论文作者
            </span>
            <span style="margin:10px" v-for="(p, index) in paper.paperDetails" :key="index">{{ p.user.name }}</span>
          </el-form-item>
        </el-form>
      </div>
      <div style="width:50%">
        <el-form>
          <el-form-item>
            <span slot="label">
              <svg-icon icon-class="vote" /> 投票结果</span>
            <el-tag v-if="paper.vote == undefined" size="small">投票未发起</el-tag>
            <el-tag type="success" size="small" v-else-if="paper.vote.result == true">ACCEPT</el-tag>
            <el-tag type="danger" size="small" v-else-if="paper.vote.result == false">REJECT</el-tag>
            <el-tag v-else size="small">等待投票结果</el-tag>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              <svg-icon icon-class="paper" /> 最终结果</span>

            <el-tag type="success" size="small" v-if="paper.result == true">ACCEPT</el-tag>
            <el-tag type="danger" size="small" v-else-if="paper.result == false">REJECT</el-tag>
            <el-tag size="small" v-else-if="paper.vote == undefined || paper.vote.result == null">论文尚未投稿</el-tag>
            <el-tag size="small" type="danger" v-else-if="paper.vote.result == false">内审未通过</el-tag>
            <el-tag size="small" v-else>等待中</el-tag>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-divider></el-divider>
    <el-alert v-if="paper.result == undefined" title="论文投稿结果尚未确定，无AC变化显示" type="warning">
    </el-alert>
    <div class="ac" v-else>
      <el-form :label-position="top">
        <el-form-item>
          <span slot="label">
            <svg-icon icon-class="paper" /> 作者AC变化</span>
          <span style="padding:6px" v-for="(item, index) in paper.paperDetails" :key="index">{{ item.user.name }}: {{ item.ac }}</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <svg-icon icon-class="paper" /> 投稿支持者AC</span>
          <span>
            <span v-if="paper.result == true">+ 1</span>
            <span v-else>- 1</span>
          </span>
          <el-tag style="margin:0px 4px;" v-for="(item, index) in acceptlist" :key="index">{{ item }}</el-tag>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <svg-icon icon-class="paper" /> 投稿反对者AC</span>
          <span v-if="paper.result == false"> + 1</span>
          <span v-else> - 1</span>
          <el-tag style="margin:0px 4px;" v-for="(item, index) in rejectlist" :key="index">{{ item }}</el-tag>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getPaper, getVoteDetail } from "@/api/paper";

export default {
  data() {
    return {
      level: [
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
      id: null,
      vote: false,
      voted: false,
      endtime: "",
      paper: {},
      acceptlist: "",
      rejectlist: ""
    };
  },
  computed: {
    getlevel() {
      return val => this.level.find(item => item.value == val).label;
    }
  },
  created() {
    this.id = this.$route.params.id;
    getPaper(this.id).then(res => {
      this.paper = res.data;
      if (this.paper.paper.result != undefined) {
        getVoteDetail(this.id).then(res => {
          this.acceptlist = res.data.acceptnames;
          this.rejectlist = res.data.rejectnames;
        });
      }
    });
  },
  methods: {
    accept() {},
    reject() {},
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.progress {
  width: 80%;
}
.box {
  margin-top: 20px;
  margin-left: 10px;
  display: flex;
  // justify-content: space-around;
  // align-items: center;
}
.test {
  padding-left: 20px;
  width: 60%;
  border: 1px;
  // border-style: solid;
}
.ac {
  padding-left: 20px;
}

.chart {
  width: 50%;
  border: 1px;
  // border-style: solid;
}
</style>
