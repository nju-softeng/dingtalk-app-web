<template>
  <div class="checked">
    <!-- 筛选 -->
    <div style="margin-bottom: 5px">
      <el-date-picker
        v-model="date"
        value-format="yyyy-MM-dd"
        type="week"
        format="yyyy 第 WW 周"
        style="width: 150px"
        placeholder="选择周"
        :picker-options="{ firstDayOfWeek: 1 }"
        @change="getDate"
      />
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-search"
        style="margin-left: 5px"
        @click="filterData"
      >
        筛选
      </el-button>
      <el-button
        size="mini"
        icon="el-icon-refresh-right"
        style="margin-left: 5px"
        @click="refresh"
      >
        重置
      </el-button>
    </div>

    <!-- 审核过的数据 -->
    <el-table
      :data="list"
      style="width: 100%"
      :header-cell-style="{ background: '#eef1f6' }"
    >
      <el-table-column width="30px" type="expand">
        <template slot-scope="props">
          <div>
            <span v-if="props.row.acItems.length === 0">无AC申请数据</span>
            <template v-else>
              <li v-for="(o, index) in props.row.acItems" :key="index">
                {{ o.reason }}, ac值: {{ o.ac }}
              </li>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="提交时间">
        <template slot-scope="{ row }">{{
          row.insertTime | parseTime("{y}-{m}-{d} {h}:{i}")
        }}</template>
      </el-table-column>
      <el-table-column label="申请周">
        <template slot-scope="{ row }">
          {{ row.yearmonth | formatWeek(row.week) }}
        </template>
      </el-table-column>
      <el-table-column label="提交人" width="100px">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="审核结果" align="center">
        <template slot-scope="{ row }">
          <el-tag style="margin-right: 10px">DC值：{{ row.dc }} </el-tag>
          <el-tag>AC值：{{ row.ac }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100px">
        <template slot-scope="{ row, $index }">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="modify(row, $index)"
          >
            修改
          </el-button>
        </template>
      </el-table-column>
      <template slot="empty">
        <div style="height: 300px">
          <div style="margin-top: 100px">
            <svg-icon icon-class="null" style="font-size: 32px" /> <br />
          </div>
          <div style="line-height: 10px">
            <span>没有已审核内容</span>
          </div>
        </div>
      </template>
    </el-table>
    <div style="text-align: center; margin-top: 8px">
      <el-pagination
        :hide-on-single-page="total < 10 ? true : false"
        small
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="10"
        :current-page.sync="currentPage"
        @prev-click="handlePrev"
        @next-click="handleNext"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 详细信息 drawer -->
    <tdrawer
      :temp="temp"
      :show.sync="show"
      :load="loading"
      @drawer-event="handleDrawer"
    />
  </div>
</template>
<script>
import { getChecked, getCheckedByDate } from "@/api/audit";
import tdrawer from "./drawer";
export default {
  components: { tdrawer },
  data() {
    return {
      list: [],
      show: false,
      loading: false,
      date: null,
      index: null,
      currentPage: 1,
      temp: {
        name: "",
        ac: "",
        dvalue: "",
        cvalue: "",
        dc: "",
        yearmonth: "",
        week: "",
        acItems: [],
      },
      total: 0,
    };
  },
  created() {
    this.fetchChecked(0);
  },
  methods: {
    fetchChecked(page) {
      getChecked(page).then((res) => {
        this.list = res.data.content || [];
        this.total = res.data.total || 0;
      });
    },
    handleCurrentChange(val) {
      this.fetchChecked(val - 1);
    },
    handlePrev(val) {
      this.fetchChecked(val - 1);
    },
    handleNext(val) {
      this.fetchChecked(val - 1);
    },
    // 点击列表中某行，触发
    modify(row, index) {
      this.temp = row;
      this.index = index;
      this.show = true;
    },
    handleDrawer(val) {
      this.loading = true;
      if (val === "prev") {
        // 上一个
        if (this.index !== 0) {
          this.index--;
          this.temp = this.list[this.index];
        }
      } else if (val === "next" || val === "continue") {
        // 下一个
        if (this.index !== this.list.length - 1) {
          this.index++;
          this.temp = this.list[this.index];
        }
      } else if (val === "submit") {
        this.fetchChecked(this.currentPage - 1);
      }
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
    // 将日期选择器的时间+2天
    getDate() {
      const date = new Date(this.date);
      this.date = new Date(date.setDate(date.getDate() + 2));
    },
    // 筛选数据
    filterData() {
      if (this.date === null) {
        this.$message.error("错了哦，日期不能为空");
      } else {
        getCheckedByDate(this.date).then((res) => {
          this.list = res.data;
        });
      }
    },
    // 刷新
    refresh() {
      this.fetchChecked(0);
    },
  },
};
</script>
