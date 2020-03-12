<template>
  <div>
    <template v-if="list.length == 0">
      <div style="height:200px;text-align:center;padding-top:70px;">
        <svg-icon icon-class="null" style="font-size:32px" />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    console.log(this.list.length);
  },
  methods: {}
};
</script>
