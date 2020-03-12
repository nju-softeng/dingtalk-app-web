<template>
  <div class="project">
    <div class="list" v-loading="loading">
      <div v-if="list.length == 0" style="margin-left: auto;margin-right: auto; padding-top:100px">
        <svg-icon icon-class="null" style="font-size:40px" />
      </div>
      <el-card class="item" v-for="(item, index) in list" :key="index" shadow="hover">
        <div>
          <div v-if="unfinish" style="float:right">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <el-button type="text"><i class="el-icon-more "></i></el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="deleteProject(item.id)" icon="el-icon-error">删除任务</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div>
            <el-link :underline="false" @click="detail(item)" type="primary">{{
              item.name
            }}</el-link>
          </div>
        </div>
        <p style="font-size:12.5px">
          <span>时间: {{ item.beginTime }} ~ {{ item.endTime }}</span>
          <template v-if="status">
            <span style="padding:15px; color:#67C23A" v-if="getRemainDay(item.endTime) >= 0">
              按时完成</span>
            <span style="padding:15px; color:#F56C6C" v-else> 延期完成</span>
          </template>
          <template v-else>
            <span style="color:#67C23A" v-if="getRemainDay(item.endTime) >= 0">
              剩余: {{ getRemainDay(item.endTime) }} 天</span>
            <span style="padding:15px;padding:15px; color:#F56C6C" v-else>
              延期: {{ -getRemainDay(item.endTime) }} 天</span>
          </template>
        </p>
        <template v-if="status">
          <el-tag style="margin-right:5px" size="small" v-for="(pd, index) in item.projectDetails" :key="index">{{ pd.user.name }} : + {{ pd.ac }}</el-tag>
        </template>
        <template v-else>
          <el-tag style="margin-right:5px" size="small" v-for="(pd, index) in item.projectDetails" :key="index">{{ pd.user.name }}</el-tag>
        </template>
        <!-- <el-button style="float:right" @click="detail(item)" size="mini">修改</el-button> -->
      </el-card>
    </div>

    <el-dialog :visible.sync="detailDialog" width="70%">
      <div slot="title">
        <span class="title-age">{{ tmp.name }} </span>
      </div>

      <div>开始时间 : {{ tmp.beginTime }}</div>

      <el-card v-loading="dcloading" class="box-card" shadow="never" style="margin-top:5px;">
        <div style="padding-bottom:10px">
          完成时间:
          <el-date-picker value-format="yyyy-MM-dd" v-model="finishtime" type="date" style="width:180px" :default-value="this.finishtime" @change="changeftime" placeholder="选择日期">
          </el-date-picker>
        </div>
        AC 分配 :
        <el-radio-group v-model="radio">
          <el-radio :label="1">默认方案</el-radio>

          <el-radio :label="2">自定义</el-radio>
        </el-radio-group>
        <div v-if="radio == 1" style="padding-top:5px;">
          <span style="color: rgba(0, 0, 0, 0.45);margin-top:5px;font-size:11px">系统根据公式: 𝐴_𝑖=𝐴_𝑎∗𝐷_𝑖/(∑𝐷)∗𝐷_𝑖/0.5 计算实际AC值</span>
          <div v-if="projectAc.valid" style="margin-top:10px">
            <div>
              <span>开发期间累计DC</span>
              <div class="projectdc">
                <el-card shadow="never" class="dcitem" v-for="(o, index) in dclist" :key="index">
                  <el-popover placement="bottom" width="180" trigger="hover">
                    <div style="text-align:center;" v-if="o.values.length == 0">
                      无DC数据
                    </div>
                    <ul>
                      <li v-for="(i, index) in o.values" :key="index">
                        {{ i.date }}: {{ i.dc }}
                      </li>
                    </ul>
                    <div slot="reference">
                      <div style="text-align:center;">{{ o.name }}</div>
                      <div style="text-align:center;">
                        {{ o.dctotal }}
                      </div>
                    </div>
                  </el-popover>
                </el-card>
              </div>
            </div>

            <p>
              <el-tooltip content="团队实际AC: 𝐴_𝑎=𝑛∗𝑚_𝑎/30" placement="top">
                <el-tag effect="plain" style="margin-right:10px;">
                  A_a : {{ projectAc.actualAc }}
                </el-tag>
              </el-tooltip>
              <el-tooltip content="团队成员平均DC之和" placement="top">
                <el-tag effect="plain" style="margin-right:10px;">
                  ∑𝐷 : {{ projectAc.totalDc }} /
                  {{ projectAc.week }}
                </el-tag>
              </el-tooltip>
              <el-tooltip content="迭代期间包含的周数，以周四为基准" placement="top">
                <el-tag effect="plain" style="margin-right:10px;">
                  开发周数：{{ projectAc.week }}
                </el-tag>
              </el-tooltip>
            </p>

            <el-table :data="projectAc.res">
              <el-table-column prop="name" label="姓名"></el-table-column>
              <el-table-column label="D_i (个人平均DC)">
                <template slot-scope="scope">
                  {{ scope.row.dc }} / {{ projectAc.week }}
                </template>
              </el-table-column>
              <el-table-column prop="ac" label="A_i (个人实际AC)"></el-table-column>
            </el-table>

            <div style=" margin-top:5px">
              <el-button size="small" @click="SetAc(tmp.id)" type="primary" style="float:right">确认完成</el-button>
              <br />
            </div>
          </div>
          <div v-else style="margin-top:10px">
            <el-alert title="开发者的DC和为0，公式无法计算，请手动分配" type="error">
            </el-alert>
          </div>
        </div>
        <div v-if="radio == 2" style="margin-top:5px;margin-top:5px">
          <span style="color: rgba(0, 0, 0, 0.45); font-size:11px">审核人自定义开发者AC值</span>

          <div class="acinput">
            <el-form label-width="70px" label-position="left">
              <el-form-item v-for="(o, index) in tmp.projectDetails" :key="index" :label="o.user.name">
                <el-input v-model="o.ac" style="width:100px"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div style=" margin-top:5px">
            <el-button size="small" @click="manualAc(tmp.id, tmp.projectDetails)" type="primary" style="float:right">确认完成</el-button>
            <br />
          </div>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>
<script>
import { listDevProject } from "@/api/project.js";

export default {
  data() {
    return {
      radio: "",
      finishtime: "",
      userlist: [],
      unfinish: true,
      dialog: false,
      list: [],
      loading: false,
      dcloading: false,
      uid: "",
      detailDialog: false,
      projectAc: {},
      tmp: {
        name: "",
        dates: ["", ""]
      },
      dclist: []
    };
  },
  created() {
    this.uid = sessionStorage.getItem("uid");
    listDevProject().then(res => {
      this.list = res.data;
      console.log(this.list);
    });
  },
  computed: {
    getRemainDay() {
      return endtime => {
        let day =
          (new Date(endtime) - new Date().setHours(8, 0, 0, 0)) /
          (24 * 3600 * 1000);
        return day;
      };
    }
  },
  methods: {
    detail(item) {
      this.detailDialog = true;
      this.tmp = item;
    }
  }
};
</script>
<style lang="scss" scoped>
.project /deep/ .el-dialog__body {
  padding-top: 5px;
}

.project /deep/ .el-card__body {
  padding: 15px;
}

.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  min-width: 750px;
}

.item {
  margin: 5px 5px 5px 0;
  height: 120px;
  width: 49%;
}

.el-form {
  width: 618px;
}

.dialog-content {
  // background-color: aquamarine;
  display: flex;
  justify-content: center;
}

.app-container {
  background-color: #f5f5f5;
  height: 92vh;
  border-radius: 0;
}
.box {
  min-height: 60px;
  background: #fff;
  padding: 10px 20px 0 20px;
}

.projectdc {
  display: flex;
  padding-top: 5px;
  padding-bottom: 10px;
  .dcitem {
    width: 150px;
    margin-right: 5px;
  }
  /deep/ .el-card__body {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
.acinput {
  /deep/ .el-form-item {
    margin-bottom: 5px;
  }
}
</style>
