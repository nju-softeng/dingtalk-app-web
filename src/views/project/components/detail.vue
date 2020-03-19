<template>
  <div class="app-container">
    <!-- 页首 -->
    <el-page-header @back="goBack">
      <span slot="title" style="font-size:12.5px">
        返回
      </span>
      <span slot="content" style="font-size:12.5px">
        {{ title }}
      </span>
    </el-page-header>
    <!-- 项目概要 -->
    <div class="info">
      <div>
        <div>迭代次数</div>
        <div class="value">{{ cnt }}</div>
      </div>

      <div>
        <div>连续按时交付数</div>
        <div class="value">{{ success }}</div>
      </div>

      <div>
        <div>bug数</div>
        <div class="value">--</div>
      </div>
    </div>

    <div class="iterate">
      <!-- 操作按钮 -->
      <div class="action" @click="dialog = true" style="">
        <el-button style="float:right" @click="newIteration" type="primary" icon="el-icon-plus">新建迭代</el-button>
        <el-radio-group style="float:right; margin:0 20px" disabled size="mini">
          <el-radio-button label="迭代"></el-radio-button>
          <el-radio-button label="bug"></el-radio-button>
        </el-radio-group>
      </div>
      <!-- 迭代表格 -->
      <el-table :show-header="theader" :data="ilist" style="width: 100%;margin-top:40px; border-top: 0.5px solid #f0f0f0">
        <el-table-column width="200">
          <template slot-scope="scope">
            <div>第{{ scope.row.cnt }}次迭代</div>

            <div>预期AC: {{ scope.row.expectedAC }}</div>
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.beginTime }} ~ {{ scope.row.endTime }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="180">
          <template slot-scope="scope">
            <div>
              完成时间
            </div>
            <template v-if="scope.row.status == false">
              <el-tag type="info">进行中</el-tag>
            </template>
            <template v-else>
              <i class="el-icon-time"></i>
              <span style="margin:0 10px">{{ scope.row.finishTime }}</span>
              <el-tag v-if="scope.row.finishTime <= scope.row.endTime" type="success">按时完成</el-tag>
              <el-tag v-else type="danger"> 延期完成 </el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <div>
              <div>开发者</div>
              <div style="min-width:300px;">
                <template v-if="scope.row.status == false">
                  <el-tag style="margin:0 4px" v-for="(o, index) in scope.row.iterationDetails" :key="index" effect="plain" size="small">{{ o.user.name }}</el-tag>
                </template>
                <template v-else>
                  <el-tag style="margin:0 4px" v-for="(o, index) in scope.row.iterationDetails" :key="index" effect="plain" size="small">{{ o.user.name }} AC: {{ o.ac }}</el-tag>
                </template>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope" v-if="scope.$index == 0">
            <template v-if="scope.row.status == false">
              <el-button type="text" @click="finishIterate(scope.$index, scope.row)">完成</el-button>
              <el-button type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
            <template v-else>
              <el-button type="text" @click="modifyIterate(scope.$index, scope.row)">修改</el-button>
            </template>

            <el-popconfirm @onConfirm="handledDelete(scope.$index, scope.row)" confirmButtonType="danger" confirmButtonText="删除" cancelButtonText="取消" icon="el-icon-info" iconColor="red" title="AC记录也会被删除,谨慎操作">
              <el-button style="margin-left:10px;" slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <iterate-dialog :pid="pid" :title="title" :cnt="cnt" :show.sync="show" :edit="tmp" />
    <finish-drawer :iterate="finishtmp" :modify="modifyAC" :title="title" :serial="serial" />
  </div>
</template>
<script>
import { getProjectDetail, rmIteration } from "@/api/project.js";
import IterateDialog from "./iterateDialog";
import FinishDrawer from "./finishDrawer";
export default {
  data() {
    return {
      show: false,
      drawer: false,
      dialog: false,
      theader: false,
      title: "",
      pid: "",
      serial: "",
      ilist: [],
      cnt: "--",
      success: "--",
      tmp: {},
      finishtmp: {},
      modifyAC: "false"
    };
  },
  components: { IterateDialog, FinishDrawer },
  computed: {
    isUpdate() {
      return this.$store.state.project.iteration;
    }
  },
  watch: {
    isUpdate() {
      if (this.isUpdate == true) {
        this.$store.commit("project/FINISH_UPDATE");
        this.fetchProjectDetail();
      }
    }
  },
  created() {
    this.pid = this.$route.params.id;
    this.fetchProjectDetail();
  },
  methods: {
    finishIterate(index, row) {
      this.modifyAC = false;
      this.serial = row.cnt;
      this.finishtmp = row;
      this.$store.commit("project/TOGGLE_DRAWER");
    },
    modifyIterate(index, row) {
      this.modifyAC = true;
      this.serial = row.cnt;
      this.finishtmp = row;
      this.$store.commit("project/TOGGLE_DRAWER");
    },
    fetchProjectDetail() {
      getProjectDetail(this.pid).then(res => {
        this.ilist = res.data.iterations;
        this.cnt = res.data.icnt;
        this.success = res.data.success;
        this.title = res.data.title;
        console.log(res.data);
      });
    },
    newIteration() {
      if (this.ilist.length == 0 || this.ilist[0].status) {
        this.tmp = null;
        this.$store.commit("project/TOGGLE_SHOW");
      } else {
        this.$message({
          showClose: true,
          message: "有迭代未完成,无法新建",
          type: "warning"
        });
      }
    },
    handleEdit(index, row) {
      this.tmp = row;
      this.$store.commit("project/TOGGLE_SHOW");
    },
    handledDelete(index, row) {
      rmIteration(row.id).then(() => {
        this.$message({
          showClose: true,
          message: "删除成功",
          type: "success"
        });
        this.fetchProjectDetail();
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    handleClose() {}
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  padding: 10px;
  background-color: #f5f5f5;
  //height: 92vh;
  border-radius: 0;
}

.info {
  background-color: #ffffff;
  margin-top: 5px;
  height: 100px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .value {
    margin-top: 16px;
    text-align: center;
  }
}

.iterate {
  background-color: #ffffff;
  margin-top: 10px;
  padding: 20px;
}
</style>
