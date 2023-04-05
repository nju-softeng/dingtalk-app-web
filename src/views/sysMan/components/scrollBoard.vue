<template>
  <div class="app-container">
    <el-table
      :data="newsData"
      fit
      highlight-current-row
      style="width: 100%"
      :header-cell-style="{ background: '#eef1f6' }"
      v-loading="loading"
    >
      <el-table-column label="#" prop="id" width="50"> </el-table-column>
      <el-table-column prop="isShown" width="100">
        <template slot="header" slot-scope="scope">
          <el-dropdown @command="filterTag">
            <span class="el-dropdown-link">
              是否显示<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="0">隐藏</el-dropdown-item>
              <el-dropdown-item :command="1">显示</el-dropdown-item>
              <el-dropdown-item :command="2">全部</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isShown === 0 ? 'primary' : 'success'"
            disable-transitions
            >{{ scope.row.isShown === 1 ? "显示" : "隐藏" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="200">
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            :content="scope.row.title"
            placement="top-start"
          >
            <div class="title">
              {{ scope.row.title }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="链接" min-width="200">
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            :content="scope.row.link"
            placement="top-start"
          >
            <div class="link">
              {{ scope.row.link }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="releaseTime" label="日期" width="150">
      </el-table-column>
      <el-table-column prop="authorName" label="发布人" width="150">
      </el-table-column>
      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-button
            icon="el-icon-plus"
            @click="
              () => {
                addNewsVisible = true;
              }
            "
            >新增
          </el-button>
        </template>
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="_deleteNews(row)"
            >删除
          </el-button>
          <template v-if="row.isShown">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="hide(row)"
              >隐藏
            </el-button>
          </template>
          <template v-else>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="show(row)"
              >显示
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center; margin-top:5px">
      <el-pagination
        background
        :hide-on-single-page="total < 10 ? true : false"
        small
        layout="prev, pager, next"
        :total="total"
        :page-size="10"
        :current-page="currentPage"
        @prev-click="handlePrev"
        @next-click="handleNext"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="新增公告" :visible.sync="addNewsVisible" width="400px">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="不宜超过25字"></el-input>
        </el-form-item>
        <el-form-item label="公告链接" prop="link">
          <el-input v-model="form.link"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="_addNews('form')"
            >立即创建</el-button
          >
          <el-button
            @click="
              () => {
                addNewsVisible = false;
              }
            "
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllNewsByPage,
  getShownNewsByPage,
  getNotShownNewsByPage,
  deleteNews,
  addNews,
  hideNews,
  showNews,
} from "@/api/scrollBoard.js";

export default {
  name: "ScrollBoardEdit",
  data() {
    return {
      addNewsVisible: false,
      newsData: [],
      total: 0,
      // 0 - 隐藏的新闻， 1 - 显示的新闻， 2 - 全部新闻
      newsType: 2,
      currentPage: 1,
      form: {
        title: null,
        link: null,
        authorId: sessionStorage.getItem("uid"),
      },
      rules: {
        title: [{ required: true, message: "请输入公告标题", trigger: "blur" }],
        link: [{ required: true, message: "请输入公告链接", trigger: "blur" }],
      },
      loading: false,
    };
  },
  created() {
    this.fetchNews(1);
  },
  methods: {
    // 获取申请记录
    fetchNews(page) {
      this.currentPage = page;
      this.loading = true;
      if (this.newsType === 2) {
        getAllNewsByPage(page, 10)
          .then((res) => {
            this.newsData = res.data.data.newsList;
            this.total = res.data.data.total;
            console.log(res.data.data.newsList);
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("网络开小差了~");
          })
          .finally(() => {
            this.loading = false;
          });
      } else if (this.newsType === 1) {
        getShownNewsByPage(page, 10)
          .then((res) => {
            if (res.data.code === 0) {
              this.newsData = res.data.data.newsList;
              this.total = res.data.data.total;
              console.log(res.data.data.newsList);
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("网络开小差了~");
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        getNotShownNewsByPage(page, 10)
          .then((res) => {
            if (res.data.code === 0) {
              this.newsData = res.data.data.newsList;
              this.total = res.data.data.total;
              console.log(res.data.data.newsList);
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("网络开小差了~");
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    // 分页获取数据
    handleCurrentChange(val) {
      this.fetchNews(val);
    },
    // 上一页
    handlePrev(val) {
      this.fetchNews(val);
    },
    // 下一页
    handleNext(val) {
      this.fetchNews(val);
    },
    // 获取按类型筛选的新闻列表
    filterTag(command) {
      console.log(command);
      this.newsType = command;
      this.fetchNews(1);
    },
    _deleteNews(row) {
      this.loading = true;
      deleteNews(row.id)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success(res.data.data);
            this.fetchNews(1);
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("网络开小差了~");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    _addNews(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          addNews(this.form.title, this.form.link, this.form.authorId)
            .then((res) => {
              if (res.data.code === 0) {
                this.$message.success(res.data.data);
                this.fetchNews(1);
                this.cancelForm();
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch((err) => {
              this.$message.error("网络开小差了~");
              console.log(err);
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.$notify({
            title: "添加失败",
            message: "请填写必要信息",
            type: "warning",
          });
        }
      });
    },
    cancelForm() {
      this.form.title = null;
      this.form.link = null;
    },
    hide(row) {
      this.loading = true;
      hideNews(row.id)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success(res.data.data);
            this.fetchNews(1);
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("网络开小差了~");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    show(row) {
      this.loading = true;
      showNews(row.id)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success(res.data.data);
            this.fetchNews(1);
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("网络开小差了~");
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.app-container {
  padding: 12px;
  background-color: #fafafa;
  border-radius: 0;
}
.link {
  color: #409eff;
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap;
  text-overflow: ellipsis;
}

.title {
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap;
  text-overflow: ellipsis;
}

.el-dropdown-link {
  cursor: pointer;
  color: #8997a5;
  font-size: 12px;
}
</style>
