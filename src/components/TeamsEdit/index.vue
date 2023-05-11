<template>
  <div>
    <el-tag
      v-if="tagList.length === 0"
      type="info"
      effect="plain"
      class="team-tag"
      >未设置</el-tag
    >
    <el-tag
      :key="tag.id"
      v-for="tag in tagList"
      class="team-tag"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag.name }}
    </el-tag>

    <el-select
      v-model="tagAddedIndex"
      placeholder="新增研究组"
      @change="handleTagAddition()"
      :style="`display: block; width:${selectionWidth}`"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { getOthersTeams, updateUserTeamList } from "@/api/team.js";
import { TeamEnum } from "@/utils/team.js";
export default {
  name: "teamEdit",
  props: {
    userId: {
      type: Number,
      default: parseInt(sessionStorage.getItem("uid")),
    },
    selectionWidth: {
      type: String,
      default: "200px",
    },
  },
  data() {
    return {
      teamList: [],
      //   tagList是permissionList的可操作备份
      tagList: [],
      options: [],
      tagAddedIndex: "",
      isEdited: false,
    };
  },
  created() {
    this.options = Reflect.ownKeys(TeamEnum).map((item) => {
      // console.log(item);
      return {
        value: TeamEnum[item].id,
        label: TeamEnum[item].teamName,
        disabled: false,
      };
    });
    this.getTeams();
    this.updateOptions();
  },
  watch: {
    userId: {
      handler(newVal, oldVal) {
        this.isEdited = false;
        this.getTeams();
        this.updateOptions();
      },
    },
  },
  methods: {
    handleClose(tag) {
      this.isEdited = true;
      this.tagList.splice(this.tagList.indexOf(tag), 1);

      this.updateOptions();
    },

    getTeams() {
      getOthersTeams(this.userId)
        .then((res) => {
          if (res.data.code === 0) {
            this.teamList = res.data.data;
            this.tagList = [...this.teamList];
            this.updateOptions();
          } else {
            console.log(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    contains(team) {
      let res = false;
      this.tagList.forEach((item) => {
        if (item.name === team.label) res = true;
      });
      //   console.log(res);
      return res;
    },
    updateOptions() {
      this.options = this.options.map((team) => {
        let tmp = {
          value: team.value,
          label: team.label,
          disabled: false,
        };
        if (this.contains(team)) {
          tmp.disabled = true;
        }
        return tmp;
      });
    },
    handleTagAddition() {
      this.isEdited = true;
      console.log(this.tagAddedIndex);
      this.tagList.push({
        id: this.options[this.tagAddedIndex - 1].value,
        name: this.options[this.tagAddedIndex - 1].label,
      });
      this.updateOptions();
      this.tagAddedIndex = null;
    },
    submitTeamChange() {
      if (!this.isEdited) return;
      let userTeamList = this.tagList.map((item) => {
        return {
          userId: this.userId,
          teamId: item.id,
        };
      });
      updateUserTeamList(userTeamList)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success(res.data.data);
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.team-tag {
  margin: 5px;
}
</style>
