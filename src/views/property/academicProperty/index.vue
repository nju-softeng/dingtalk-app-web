<template>
  <div class="app-container">
    <div class="paper-box">
      <div class="action">
        <tabs v-model="activeTab">
          <tab-pane label="文献数字文档" name="digitalDoc" />
          <tab-pane label="项目过程产物" name="projectProcess" />
          <tab-pane label="学生毕业论文" name="studentDissertation" />
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
      activeTab: 'digitalDoc'
    }
  },
  created() {
    if (this.$route.params.type === 'digitalDoc') {
      this.activeTab = 'digitalDoc'
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

  .card {
    width: 25vh;
    height: 25vh;
    margin: 10px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }

  .paper-form {
    display: flex;
  }

  .dialog-content {
    display: flex;
    justify-content: center;
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
