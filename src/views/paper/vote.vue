<template>
  <div class="app-container">
    <el-page-header @back="goBack"> </el-page-header>

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
            <span style="margin:10px" v-for="p in paper.paperDetails" :key="p.index">{{ p.user.name }}</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="chart">
        <div>
          <el-button type="primary" v-if="!vote" @click="dialog = true">发起投票</el-button>
        </div>

        <div v-if="vote" style="width:50%">
          <el-popconfirm title="确定要接受吗？">
            <el-button slot="reference" type="success">Accept</el-button>
          </el-popconfirm>

          <el-popconfirm style="margin-left:100px" confirmButtonText="好的" cancelButtonText="再想想" icon="el-icon-info" iconColor="red" title="确定要拒绝吗？">
            <el-button slot="reference" type="danger">Reject</el-button>
          </el-popconfirm>
        </div>

        <div v-if="vote && voted">
          <el-form>
            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="paper" /> Accept {{}}</span>
              <el-progress class="progress" :percentage="100" status="success"></el-progress>
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <svg-icon icon-class="paper" /> Reject {{}}</span>
              <el-progress class="progress" :percentage="50" status="exception"></el-progress>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <el-dialog title="发起投票" :visible.sync="dialog" width="40%">
      <span style="margin-right:10px">截止时间 </span>
      <el-time-select v-model="endtime" :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30'
        }" placeholder="截止时间">
      </el-time-select>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="createVote">确 定</el-button>
      </span>
    </el-dialog>
    {{ vote }}
    <!-- {{ paper }} -->
  </div>
</template>
<script>
import { getPaper } from "@/api/paper";

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
      dialog: false,
      vote: false,
      voted: false,
      endtime: "",
      paper: {}
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
    });
    console.log(this.$route.params.id);
  },
  methods: {
    createVote() {
      console.log("????");
      this.dialog = false;
      this.vote = true;
    },
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
  flex-direction: column;
  align-items: center;
}
.test {
  width: 50%;
  border: 1px;
  // border-style: solid;
}
.chart {
  width: 50%;
  border: 1px;
  // border-style: solid;
}
</style>
