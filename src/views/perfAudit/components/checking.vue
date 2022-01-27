<template>
  <div class="checking">
    <div>
      <el-table
        :data="list"
        style="width: 100%"
        :row-style="{ height: '37.67px' }"
        :row-class-name="addIndex"
        :header-cell-style="{ background: '#eef1f6' }"
        @row-click="onRowClick"
      >
        <el-table-column label="提交时间" align="center">
          <template slot-scope="{ row }">
            {{ row.insertTime | parseTime("{y}-{m}-{d} {h}:{i}") }}
          </template>
        </el-table-column>
        <el-table-column label="申请周" align="center">
          <template slot-scope="{ row }">{{
            row.yearmonth | formatWeek(row.week)
          }}</template>
        </el-table-column>
        <el-table-column prop="name" label="提交人" align="center" />
        <el-table-column prop="dvalue" label="申请D值" align="center" />
        <el-table-column label="  AC申请" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.acItems.length === 0" style="margin: 0px 5px"
              >无</el-tag
            >
            <el-tag
              v-for="(item, index) in row.acItems"
              :key="index"
              style="margin: 0px 5px"
              >{{ item.reason }} : {{ item.ac }}</el-tag
            >
          </template>
        </el-table-column>
        <template slot="empty">
          <div style="height: 300px">
            <div style="margin-top: 100px">
              <svg-icon icon-class="null" style="font-size: 32px" /> <br />
            </div>
            <div style="line-height: 10px">
              <span>待审核申请为空</span>
            </div>
          </div>
        </template>
      </el-table>
    </div>

    <!-- drawer -->
    <tdrawer
      :temp="temp"
      :show.sync="show"
      :load="loading"
      @drawer-event="handleDrawer"
    />
  </div>
</template>
<script>
import { getToChecked } from "@/api/audit";
import tdrawer from "./drawer";
export default {
  components: { tdrawer },
  data() {
    return {
      show: false,
      loading: false,
      list: [],
      index: 0,
      temp: {},
    };
  },
  created() {
    getToChecked().then((res) => {
      this.list = res.data;
    });
  },
  methods: {
    handleDrawer(val) {
      this.loading = true;
      if (val === "next") {
        // 下一个
        if (this.index !== this.list.length - 1) {
          this.index++;
          this.temp = this.list[this.index];
        }
      } else if (val === "prev") {
        // 上一个
        if (this.index !== 0) {
          this.index--;
          this.temp = this.list[this.index];
        }
      } else if (val === "continue") {
        // 提交
        if (this.index === 0 && this.list.length === 1) {
          this.list.splice(this.index, 1);
          this.show = false;
        } else if (this.index === this.list.length - 1) {
          this.index--;
          this.temp = this.list[this.index];
          this.list.splice(this.index + 1, 1);
        } else {
          this.list.splice(this.index, 1);
          this.temp = this.list[this.index];
        }
      } else if (val === "close") {
        getToChecked().then((res) => {
          this.list = res.data;
        });
      }
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
    onRowClick(row) {
      this.temp = row;
      this.index = row.index; // 指定当前列
      this.show = true;
    },
    addIndex({ row, rowIndex }) {
      row.index = rowIndex; // 为表格的每一行增加索引
    },
  },
};
</script>
