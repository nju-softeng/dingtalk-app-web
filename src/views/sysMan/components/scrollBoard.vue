<template>
  <div class="app-container">
    <el-table
      v-loading="loading"
      :data="newsData"
      fit
      highlight-current-row
      style="width: 100%"
      :header-cell-style="{ background: '#eef1f6' }"
    >
      <el-table-column label="#" prop="id" width="50" />
      <el-table-column prop="isShown" width="100">
        <template slot="header" slot-scope="scope">
          <el-dropdown @command="filterTag">
            <span class="el-dropdown-link">
              是否显示<i class="el-icon-arrow-down el-icon--right" />
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
          >{{ scope.row.isShown === 1 ? "显示" : "隐藏" }}</el-tag>
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
      <!-- <el-table-column label="链接" min-width="200">
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
      </el-table-column> -->
      <el-table-column label="详情" min-width="200">
        <template slot-scope="scope">
          <!-- <v-md-editor v-model="scope.row.content" mode="preview" /> -->
          <span class="content" @click="checkDetail(scope.row)">{{
            scope.row.content
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="releaseTime" label="日期" width="150">
        <template slot-scope="scope">
          {{ scope.row.releaseTime.replace("T", " ") }}
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="发布人" width="150" />
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
    <el-dialog
      title="新增公告"
      :visible.sync="addNewsVisible"
      :width="device === 'mobile' ? '400px' : '850px'"
    >
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="不宜超过25字" />
        </el-form-item>
        <!-- <el-form-item label="公告链接" prop="link">
          <el-input v-model="form.link"></el-input>
        </el-form-item> -->
        <el-form-item label="内容详情" prop="content">
          <template v-if="device === 'mobile'">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="3"
            />
            <el-tooltip content="电脑端支持md格式" placement="right">
              <span style="align-self: center;">
                <i class="el-icon-warning-outline" />
              </span>
            </el-tooltip>
          </template>

          <template v-else>
            <v-md-editor
              v-model="form.content"
              mode="edit"
              class="editor"
              height="250px"
              @save="save"
            />
          </template>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="_addNews('form')"
          >立即创建</el-button>
          <el-button
            @click="
              () => {
                addNewsVisible = false;
              }
            "
          >取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="公告详情"
      :visible.sync="newsContentVisible"
      width="400px"
    >
      <v-md-editor v-model="activeRow.content" mode="preview" />
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
  showNews
} from '@/api/scrollBoard.js'
import { mapState } from 'vuex'

export default {
  name: 'ScrollBoardEdit',
  data() {
    var checkContent = (rule, value, callback) => {
      // console.log(this.form.content);
      if (this.form.content === '') {
        return callback(new Error('内容详情不能为空'))
      }
      callback()
    }

    return {
      addNewsVisible: false,
      newsContentVisible: false,
      newsData: [],
      total: 0,
      // 0 - 隐藏的新闻， 1 - 显示的新闻， 2 - 全部新闻
      newsType: 2,
      currentPage: 1,
      form: {
        title: null,
        // link: null,
        authorId: sessionStorage.getItem('uid'),
        content: localStorage.getItem('news-content') || ''
      },
      rules: {
        title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
        content: [{ required: true, validator: checkContent, trigger: 'blur' }]
      },
      loading: false,
      activeRow: {
        content: ''
      }
    }
  },
  computed: {
    ...mapState({
      device: (state) => state.app.device
    })
  },
  created() {
    this.fetchNews(1)
  },
  methods: {
    // 获取申请记录
    fetchNews(page) {
      this.currentPage = page
      this.loading = true
      if (this.newsType === 2) {
        getAllNewsByPage(page, 10)
          .then((res) => {
            this.newsData = res.data.data.newsList
            this.total = res.data.data.total
            console.log(res.data.data.newsList)
          })
          .catch((err) => {
            console.log(err)
            this.$message.error('网络开小差了~')
          })
          .finally(() => {
            this.loading = false
          })
      } else if (this.newsType === 1) {
        getShownNewsByPage(page, 10)
          .then((res) => {
            if (res.data.code === 0) {
              this.newsData = res.data.data.newsList
              this.total = res.data.data.total
              console.log(res.data.data.newsList)
            } else {
              this.$message.error(res.data.message)
            }
          })
          .catch((err) => {
            console.log(err)
            this.$message.error('网络开小差了~')
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        getNotShownNewsByPage(page, 10)
          .then((res) => {
            if (res.data.code === 0) {
              this.newsData = res.data.data.newsList
              this.total = res.data.data.total
              console.log(res.data.data.newsList)
            } else {
              this.$message.error(res.data.message)
            }
          })
          .catch((err) => {
            console.log(err)
            this.$message.error('网络开小差了~')
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    // 分页获取数据
    handleCurrentChange(val) {
      if (val == this.currentPage) return
      // console.log("handleCurrentChange");
      this.fetchNews(val)
    },
    // 上一页
    handlePrev(val) {
      this.fetchNews(val)
    },
    // 下一页
    handleNext(val) {
      // console.log("handleNext");
      this.fetchNews(val)
    },
    // 获取按类型筛选的新闻列表
    filterTag(command) {
      console.log(command)
      this.newsType = command
      this.fetchNews(1)
    },
    _deleteNews(row) {
      this.loading = true
      deleteNews(row.id)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success(res.data.data)
            this.fetchNews(1)
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('网络开小差了~')
        })
        .finally(() => {
          this.loading = false
        })
    },
    _addNews(formName) {
      console.log(this.form)
      this.$refs[formName].validate((valid) => {
        console.log('valid')
        if (valid) {
          this.loading = true
          addNews(this.form.title, this.form.authorId, this.form.content)
            .then((res) => {
              if (res.data.code === 0) {
                this.$message.success(res.data.data)
                this.fetchNews(1)
                this.cancelForm()
              } else {
                this.$message.error(res.data.message)
              }
            })
            .catch((err) => {
              this.$message.error('网络开小差了~')
              console.log(err)
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          this.$notify({
            title: '添加失败',
            message: '请填写必要信息',
            type: 'warning'
          })
        }
      })
    },
    cancelForm() {
      this.form.title = null
      this.form.link = null
      this.form.content = ''
    },
    hide(row) {
      this.loading = true
      hideNews(row.id)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success(res.data.data)
            this.fetchNews(1)
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('网络开小差了~')
        })
        .finally(() => {
          this.loading = false
        })
    },
    show(row) {
      this.loading = true
      showNews(row.id)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success(res.data.data)
            this.fetchNews(1)
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('网络开小差了~')
        })
        .finally(() => {
          this.loading = false
        })
    },
    checkDetail(row) {
      this.newsContentVisible = true
      this.activeRow = { ...row }
      if (this.activeRow.content === '') this.activeRow.content = '无详情'
    },
    save() {
      localStorage.setItem('news-content', this.form.content)
    }
  }
}
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

.content {
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
