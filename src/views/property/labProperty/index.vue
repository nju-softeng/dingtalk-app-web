<template>
  <div class="app-container">
    <div class="paper-box">
      lab picture and video
    </div>
  </div>
</template>

<script>
export default {
  name: 'LabProperty'
}
</script>

<style scoped>
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
