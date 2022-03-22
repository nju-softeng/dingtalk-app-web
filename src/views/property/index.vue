<template>
  <div class="app-container">
    <div class="property-box">
      <div class="action">
        <tabs v-model="activeTab">
          <tab-pane label="学术资产" name="academicProperty" />
          <tab-pane label="项目资产" name="projectProperty" />
          <tab-pane label="实验室团队产出" name="labProperty" />
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
import academicProperty from '@/views/property/components/academicProperty'
import labProperty from '@/views/property/components/eventProperty'
import projectProperty from '@/views/property/components/projectProperty'
export default {
  name: 'Index',
  components: {
    Tabs,
    TabPane,
    academicProperty,
    labProperty,
    projectProperty
  },
  data() {
    return {
      activeTab: 'academicProperty'
    }
  },
  created() {
    if (this.$route.params.type === 'academic') {
      this.activeTab = 'academic'
    } else if (this.$route.params.type === 'project') {
      this.activeTab = 'project'
    } else if (this.$route.params.type === 'lab') {
      this.activeTab = 'lab'
    }
  }
}
</script>

<style lang="css" scoped>
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

  .property-box {
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
  }

  @media only screen and (min-width: 1400px) {
    .property-box {
      max-width: 1305px !important;
    }
  }
</style>
