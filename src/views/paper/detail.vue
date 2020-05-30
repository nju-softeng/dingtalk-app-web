<template>
  <div class="app-container">
    <div class="box">
      <el-page-header @back="goBack">
        <span slot="title" style="font-size:12.5px">
          返回
        </span>
      </el-page-header>
      <el-row>
        <el-col :xs="24" :sm="12" :lg="12">
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
                {{ getlevel(paper.paperType) }}
              </el-form-item>
              <el-form-item>
                <span slot="label">
                  <svg-icon icon-class="people" /> 论文作者
                </span>
                <span style="margin:10px" v-for="(p, index) in paper.paperDetails" :key="index">{{ p.user.name }}</span>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="12">
          <div class="test">
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
                <el-tag size="small" v-else-if="
                    paper.vote == undefined || paper.vote.result == null
                  ">论文尚未投稿</el-tag>
                <el-tag size="small" type="danger" v-else-if="paper.vote.result == false">内审未通过</el-tag>
                <el-tag size="small" v-else>等待中</el-tag>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>

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
  </div>
</template>
<script>
import { getPaper, getVoteDetail } from "@/api/paper";

export default {
  data() {
    return {
      level: [
        {
          value: "JOURNAL_A",
          label: "Journal A"
        },
        {
          value: "CONFERENCE_A",
          label: "Conference A"
        },
        {
          value: "JOURNAL_B",
          label: "Journal B"
        },
        {
          value: "CONFERENCE_B",
          label: "Conference B"
        },
        {
          value: "JOURNAL_C",
          label: "Journal C"
        },
        {
          value: "CONFERENCE_C",
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
.content {
  margin-top: 20px;
  margin-left: 10px;
  display: flex;
}
.test {
  padding-left: 20px;

  border: 1px;
}
.ac {
  padding-left: 20px;
}

.app-container {
  min-height: 95vh;
}

.box {
  max-width: 1056px;
  margin-left: auto;
  margin-right: auto;
  min-height: 86vh;
  background: #fff;
  padding: 15px 20px 0;
}
</style>
