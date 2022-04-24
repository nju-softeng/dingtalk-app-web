<template>
  <div class="app-container">
    <div class="paper-box">
      <div class="action">
        <tabs v-model="activeTab">
          <tab-pane label="项目过程产物" name="projectProcess" />
          <tab-pane label="学生毕业论文" name="studentDissertation" />
          <tab-pane label="文献数字文档" name="digitalDoc" />
        </tabs>
      </div>
      <div>
        <component :is="activeTab" />
      </div>
    </div>
  </div>
</template>

<script>
import Tabs from '@/components/TabNav/tabs'
import TabPane from '@/components/TabNav/tabpane'
import digitalDoc from './components/digitalDoc'
import projectProcess from './components/projectProcess'
import studentDissertation from './components/studentDissertation'
export default {
  name: 'AcademicProperty',
  components: {
    Tabs,
    TabPane,
    digitalDoc,
    projectProcess,
    studentDissertation
  },
  data() {
    return {
      activeTab: 'projectProcess'
    }
  },
  computed: {
  },
  created() {
    if (this.$route.params.type === 'digitalDoc') {
      this.$router.push('/paper/index/internal').then(() => {
        this.$message.success('已为你自动跳转至论文管理')
      })
    } else if (this.$route.params.type === 'projectProcess') {
      this.activeTab = 'projectProcess'
    } else if (this.$route.params.type === 'studentDissertation') {
      this.activeTab = 'studentDissertation'
    }
  }
}
</script>

<style scoped>
  .action {
    margin-bottom: 5px;
    margin-right: 8px;
    display: flex;
    justify-content: space-between;
    align-content: center;
  }

  .app-container {
    background-color: #fafafa;
  }

  .paper-box {
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
  }

  @media only screen and (min-width: 1400px) {
    .paper-box {
      max-width: 1305px !important;
    }
  }
</style>
