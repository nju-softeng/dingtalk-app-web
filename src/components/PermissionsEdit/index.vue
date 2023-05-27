<template>
  <div>
    <el-tag
      v-if="tagList.length === 0"
      type="info"
      effect="plain"
      class="permission-tag"
    >无管理员权限</el-tag>
    <el-tag
      v-for="tag in tagList"
      :key="tag.id"
      class="permission-tag"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag.name }}
    </el-tag>

    <el-select
      v-model="tagAddedIndex"
      placeholder="新增权限"
      style="display: block; width:200px"
      @change="handleTagAddition()"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      />
    </el-select>
  </div>
</template>

<script>
import {
  getOthersPermissions,
  updateUserPermissionList
} from '@/api/permission.js'
import { permissionEnum } from '@/utils/permission.js'
export default {
  name: 'PermissionEdit',
  props: {
    userId: {
      type: Number,
      required: true,
      default: 104
    }
  },
  data() {
    return {
      permissionList: [],
      //   tagList是permissionList的可操作备份
      tagList: [],
      options: [],
      tagAddedIndex: null,
      isEdited: false
    }
  },
  watch: {
    userId: {
      handler(newVal, oldVal) {
        this.isEdited = false
        this.getPermission()
        this.updateOptions()
      }
    }
  },
  created() {
    // console.log(permissionEnum);
    this.options = Reflect.ownKeys(permissionEnum).map((item) => {
      // console.log(item);
      return {
        value: permissionEnum[item].id,
        label: permissionEnum[item].permissionName,
        disabled: false
      }
    })
    this.getPermission()
    this.updateOptions()
  },
  methods: {
    handleClose(tag) {
      this.isEdited = true
      this.tagList.splice(this.tagList.indexOf(tag), 1)

      this.updateOptions()
    },

    getPermission() {
      getOthersPermissions(this.userId)
        .then((res) => {
          if (res.data.code === 0) {
            this.permissionList = res.data.data
            this.tagList = [...this.permissionList]
            this.updateOptions()
          } else {
            console.log(res.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    contains(permission) {
      let res = false
      this.tagList.forEach((item) => {
        if (item.name === permission.label) res = true
      })
      //   console.log(res);
      return res
    },
    updateOptions() {
      //   console.log("dfskf");
      this.options = this.options.map((permission) => {
        const tmp = {
          value: permission.value,
          label: permission.label,
          disabled: false
        }
        if (this.contains(permission)) {
          tmp.disabled = true
          //   console.log("dssfsdf");
        }
        return tmp
      })
      //   console.log(this.options);
    },
    handleTagAddition() {
      //   console.log(this.tagAddedIndex);
      this.isEdited = true
      this.tagList.push({
        id: this.options[this.tagAddedIndex - 1].value,
        name: this.options[this.tagAddedIndex - 1].label
      })
      this.updateOptions()
      this.tagAddedIndex = null
      //   console.log(this.tagList);
    },
    submitPermissionChange() {
      if (!this.isEdited) return
      const userPermissionList = this.tagList.map((item) => {
        return {
          userId: this.userId,
          permissionId: item.id
        }
      })
      updateUserPermissionList(userPermissionList)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success(res.data.data)
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
.permission-tag {
  margin: 5px;
}
</style>
