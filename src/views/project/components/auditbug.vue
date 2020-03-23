<template>
  <div>
    <div>
      <!-- 切换按钮 -->
      <div style="margin-bottom:10px;">
        <el-radio-group v-model="radio" @change="changeRadio" size="mini">
          <el-radio-button label="全部"></el-radio-button>
          <el-radio-button label="待处理"></el-radio-button>
          <el-radio-button label="已处理"></el-radio-button>
        </el-radio-group>
      </div>
      <!-- bug表格 -->
      <el-table :data="list" class="btable" :show-header="false" @row-click="rowClick">
        <el-table-column>
          <template slot-scope="scope">
            <p>
              <el-popover placement="bottom" title="标题" width="358" trigger="hover">
                <div>
                  <p>
                    {{ scope.row.description }}
                  </p>
                </div>
                <span slot="reference">
                  <span style="margin-right:10px">{{
                    scope.row.project.title
                  }}</span>
                  <span>{{ scope.row.title }}</span>
                </span>
              </el-popover>
            </p>

            <p>
              <span>提交与 {{ scope.row.insertTime | formatDate }}</span>
              <span style="margin: 0 8px">
                状态：
                <el-tag v-if="scope.row.status == undefined"> 待确认</el-tag>
                <el-tag v-else-if="scope.row.status">bug成立</el-tag>
                <el-tag v-else>bug不成立</el-tag>
              </span>
              <span v-if="scope.row.status">
                bug责任人：
                <el-tag effect="plain" v-for="(item, index) in scope.row.bugDetails" :key="index" style="margin:0 8px">{{ item.user.name }} AC: {{ item.ac }}</el-tag>
              </span>
            </p>
          </template>
        </el-table-column>

        <template slot="empty">
          <div style="height:200px;">
            <div style="margin-top:100px;">
              <svg-icon icon-class="null" style="font-size:32px" /> <br />
            </div>
            <div style="line-height: 10px;">
              <span>没有bug记录</span>
            </div>
          </div>
        </template>
      </el-table>
      <!-- 操作drawer -->
      <el-drawer :visible.sync="drawer" @close="closeDrawer" :modal="false" direction="rtl" size="40%">
        <div slot="title">{{ tmp.title }}</div>
        <div class="content">
          <!-- bug 描述 -->
          <div style="font-size:14px; margin-bottom:20px">
            <label style="color: #72767b;">bug 描述</label>
            <p>{{ tmp.description }}</p>
          </div>
          <el-divider></el-divider>
          <div style="margin-top:20px">
            <div>
              <label style="font-size:14px;"> bug 是否存在: </label>
              <el-switch style="margin-right:10px" v-model="checkform.status" active-color="#ff4949" inactive-color="#13ce66">
              </el-switch>
              <el-tag v-if="checkform.status == true">存在bug</el-tag>
              <el-tag v-else>无bug</el-tag>
            </div>
            <template v-if="checkform.status">
              <div style="margin:16px 0">
                <label style="font-size:14px;"> bug 所属迭代: </label>

                <el-select v-model="iteration" placeholder="请选择">
                  <el-option v-for="item in iterations" :key="item.id" :label="'第' + item.cnt + '次迭代'" :value="item">
                  </el-option>
                </el-select>
              </div>
              <div>
                <label style="font-size:14px;"> bug 主要负责人: </label>
                <div style="margin:10px 0">
                  <el-radio-group v-model="principalradio">
                    <el-radio :label="o.user.id" v-for="(o, index) in iteration.iterationDetails" :key="index">{{ o.user.name }}</el-radio>
                  </el-radio-group>
                </div>
                <el-alert type="info">
                  <div slot="title">
                    <p>bug主要负责人扣除0.1 AC</p>
                    <p>其他成员扣除 0.1/n-1 AC</p>
                  </div>
                </el-alert>
              </div>
            </template>
            <template v-else>
              <el-alert type="success" style="margin-top:16px">
                <div slot="title">
                  <p>没有bug,开发者的AC将不会减少</p>
                </div>
              </el-alert>
            </template>
          </div>
          <div class="drawer-footer">
            <el-button style="width:50%" type="primary" @click="submitCheckBug" :loading="loading">{{ loading ? "提交中 ..." : "确 定" }}</el-button>
            <el-button style="width:50%" @click="drawer = false">取 消</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>
<script>
import { listAuditorBug, checkBug } from "@/api/bug.js";
import { listProjectIteration } from "@/api/project.js";
export default {
  data() {
    return {
      uid: "",
      list: [],
      alllist: [],
      checklist: [],
      unchecklist: [],
      radio: "全部",
      drawer: false,
      tmp: {},
      principalradio: "",
      options: [],
      iterations: [],
      iteration: [],
      loading: false,
      checkform: {
        id: "",
        status: true,
        iterationId: "",
        uid: ""
      }
    };
  },
  created() {
    this.uid = sessionStorage.getItem("uid");
    this.fetchAuditorBug();
  },
  methods: {
    fetchAuditorBug() {
      listAuditorBug(this.uid).then(res => {
        this.alllist = res.data;
        this.checklist = res.data.filter(item => item.status != undefined);
        this.unchecklist = res.data.filter(item => item.status == undefined);
        if (this.radio == "全部") {
          this.list = this.alllist;
        } else if (this.radio == "待处理") {
          this.list = this.unchecklist;
        } else {
          this.list = this.checklist;
        }
      });
    },
    rowClick(val) {
      this.drawer = true;
      this.tmp = val;
      this.checkform.id = this.tmp.id;
      listProjectIteration(val.project.id).then(res => {
        this.iterations = res.data;
      });
    },
    changeRadio(val) {
      if (val == "全部") {
        this.list = this.alllist;
      } else if (val == "待处理") {
        this.list = this.unchecklist;
      } else {
        this.list = this.checklist;
      }
    },
    submitCheckBug() {
      console.log(this.iteration.id, this.principalradio);

      if (this.checkform.status == false) {
        checkBug(this.checkform).then(() => {
          this.fetchAuditorBug().then(() => {
            this.$message({
              message: "提交成功",
              type: "success"
            });
          });
        });
      } else {
        if (this.iteration && this.principalradio) {
          this.checkform.iterationId = this.iteration.id;
          this.checkform.uid = this.principalradio;
          this.$message({
            message: "提交成功",
            type: "success"
          });
          checkBug(this.checkform).then(() => {
            this.fetchAuditorBug().then(() => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
            });
          });
        } else {
          this.$message({
            showClose: true,
            message: "请将表单填写完整",
            type: "error"
          });
        }
      }
    },
    closeDrawer() {}
  }
};
</script>
<style lang="scss" scoped>
.btable {
  border-top: 0.5px solid #f0f0f0;
}
.content {
  padding: 0 20px;
}

label {
  color: #72767b;
}

.drawer-footer {
  /* background-color: beige; */
  margin: 16px 0;
  display: flex;
}
</style>
