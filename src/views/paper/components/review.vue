<template>
  <div class="box-r">
    <el-alert v-if="device === 'mobile'" class="display-xs" title="请在PC客户端上提交 review" type="success" />
    <div v-if="device !== 'mobile'" class="md-container hiden-xs">
      <el-avatar style="margin-right:16px;" class="hiden-sm" shape="square" size="medium" :src="avatar"> {{ name }}</el-avatar>
      <div style="margin-bottom:24px">
        <div style="width: 90vw;max-width: 1100px">
          <v-md-editor v-model="value" mode="edit" height="280px" class="editor" style="width: 100%; " @save="save" />
        </div>

        <el-button style="margin-top:8px" @click="submit"> 提交</el-button>
      </div>
    </div>
    <div style="overflow: auto; padding-bottom: 50px">
      <div v-for="(item, index) in list" :key="index" class="md-container" style="margin-bottom:24px">
        <el-avatar style="margin:16px 16px 0 0" class="hiden-sm" shape="square" size="medium" :src="item.user.avatar">{{ item.user.name }}</el-avatar>
        <div style="flex-grow:1">
          <div style="padding-top: 16px; padding-bottom: 8px">
            <span style="font-size:14px;">{{ item.user.name }} </span>
            <span style=" font-size:12px; color:#595959; padding:8px"> {{ item.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            <template v-if="uid == item.user.id">
              <el-button type="text" style="margin-right:4px" @click="item.edit = true">编辑</el-button>
              <el-popconfirm confirm-button-text="好的" cancel-button-text="不用了" icon="el-icon-info" icon-color="red" title="确定删除吗？" @confirm="remove(item.id)">
                <el-button slot="reference" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </div>
          <div>
            <div style="width: 90vw;max-width: 1100px">
              <v-md-editor v-model="item.md" :mode="item.edit === false ? 'preview' : 'edit'" />
            </div>

            <div v-if="item.edit === true" style="margin-top:8px">
              <el-button @click="update(item)"> 提交</el-button>
              <el-button @click="fetchReview()"> 取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { submitReview, listReview, listExReview, updateReview, deleteReview } from '@/api/paper'
import { mapState } from 'vuex'
export default {
  props: ['paperid'],
  data() {
    return {
      isExternal: false,
      value: '',
      list: [],
      uid: null,
      avatar: '',
      name: ''
    }
  },
  created() {
    const path = this.$route.path
    this.isExternal = (path.slice(7, 16) === 'ex-detail')
    console.log(this.isExternal)
    this.fetchReview()
    this.value = localStorage.getItem('review-content') || ''
    this.uid = sessionStorage.getItem('uid')
    this.avatar = sessionStorage.getItem('avatar')
    this.name = sessionStorage.getItem('name')
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  methods: {
    fetchReview() {
      if (this.isExternal) {
        listExReview(this.paperid).then(res => {
          this.list = res.data
          this.list.forEach(item => {
            this.$set(item, 'edit', false)
          })
        })
      } else {
        listReview(this.paperid).then(res => {
          this.list = res.data
          this.list.forEach(item => {
            this.$set(item, 'edit', false)
          })
        })
      }
    },
    edit(data) {
      data.edit = true
    },
    save() {
      localStorage.setItem('review-content', this.value)
    },
    submit() {
      if (this.value === '') {
        this.$notify({
          title: '内容不能为空',
          message: '这是一条成功的提示消息',
          type: 'warning'
        })
        return
      }
      console.log(this.isExternal)
      submitReview({
        paperid: this.paperid,
        md: this.value,
        external: this.isExternal
      }).then(() => {
        this.fetchReview()
        this.value = ''
        this.$notify({
          title: '成功',
          message: '评审意见提交成功',
          type: 'success'
        })
      })
    },
    update(data) {
      updateReview(data, this.paperid).then(() => {
        this.fetchReview()
        this.value = ''
        this.$notify({
          title: '更新成功',
          type: 'success'
        })
      })
    },
    remove(id) {
      deleteReview(id).then(() => {
        this.fetchReview()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.md-container {
  display: flex;
}

/deep/ .v-md-editor-preview {
  padding: 0 20px;
}

.box-r {
  min-height: 80vh;
  overflow: auto;
  border-radius: 2px;
  max-width: 1230px;
  margin-left: auto;
  margin-right: auto;
  padding: 10px 20px 0;
}

@media only screen and (max-width: 1215px) {
  .hiden-sm {
    display: none !important;
  }
}

@media only screen and (max-width: 899px) {
  .editor {
    width: 820px !important;
  }
  .display-xs {
    display: none;
  }
  .box-r {
    padding: 5px auto !important;
  }

}

.display-xs {
  display: block;
}

</style>
