<template>
  <div class="app-container">
    <div class="test">
      <draggable v-model="list" class="test" :options="{ group: 'card' }">
        <div v-for="(item, index) in list" :key="index" class="card" shadow="never">
          从不显示{{ item }}

          <draggable v-model="item.arr" :options="{ group: 'task' }">
            <el-card v-for="task in item.arr" :key="task.index" class="task">
              {{ task }}
            </el-card>
          </draggable>
        </div>
      </draggable>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  data() {
    return {
      list: [
        {
          arr: [34, 5]
        },
        {
          arr: [45, 667, 56]
        },
        {
          arr: [34, 56]
        },
        {
          arr: [1, 2, 3, 4]
        }
      ]
      // list: message.map((name, index) => {
      //   return { name, order: index + 1, fixed: false };
      // }),
    };
  },
  components: {
    draggable
  },
  created() {},
  methods: {}
};
</script>

<style scoped>
.app-container {
  background-color: #f5f5f5;
  height: 92.8vh;
  border-radius: 0;
}
.test {
  display: flex;
  overflow-x: auto;
}
.card {
  margin: 5px;
  flex-shrink: 0;
  width: 45vh;
  height: 85.5vh;
}
.task {
  width: 100%;
}
</style>
